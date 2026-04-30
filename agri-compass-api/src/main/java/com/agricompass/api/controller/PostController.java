package com.agricompass.api.controller;

import com.agricompass.api.entity.Comment;
import com.agricompass.api.entity.Post;
import com.agricompass.api.entity.PostLike;
import com.agricompass.api.entity.UserProfile;
import com.agricompass.api.repository.CommentRepository;
import com.agricompass.api.repository.PostLikeRepository;
import com.agricompass.api.repository.PostRepository;
import com.agricompass.api.repository.UserProfileRepository;
import com.agricompass.api.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentRepository commentRepository;
    private final UserProfileRepository profileRepository;
    private final UserService userService;

    // GET /api/posts
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getPosts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String user,
            @AuthenticationPrincipal Jwt jwt) {

        String currentUserId = jwt != null ? jwt.getSubject() : null;
        List<Post> posts = postRepository.findWithFilters(q, location, user);

        List<Map<String, Object>> result = posts.stream().map(post -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", post.getId());
            dto.put("user_id", post.getUserId());
            dto.put("title", post.getTitle());
            dto.put("body", post.getBody());
            dto.put("content", post.getBody());
            dto.put("location", post.getLocation());
            
            ObjectMapper mapper = new ObjectMapper();
            List<String> imageList = new ArrayList<>();
            if (post.getImages() != null && post.getImages().startsWith("[")) {
                try {
                    imageList = mapper.readValue(post.getImages(), List.class);
                } catch (Exception e) {}
            }
            dto.put("images", imageList);
            dto.put("video_url", post.getVideoUrl());
            dto.put("kn_caption", post.getKnCaption());
            dto.put("created_at", post.getCreatedAt());
            dto.put("updated_at", post.getUpdatedAt());

            dto.put("_count", Map.of(
                "likes", postLikeRepository.countByPostId(post.getId()),
                "comments", commentRepository.countByPostId(post.getId())
            ));

            dto.put("isLiked", currentUserId != null &&
                postLikeRepository.findByPostIdAndUserId(post.getId(), currentUserId).isPresent());

            Optional<UserProfile> profile = profileRepository.findById(post.getUserId());
            dto.put("user", profile.map(p -> Map.of(
                "id", p.getId(),
                "username", p.getUsername() != null ? p.getUsername() : "",
                "full_name", p.getFullName() != null ? p.getFullName() : "",
                "avatar_url", p.getAvatarUrl() != null ? p.getAvatarUrl() : ""
            )).orElse(Map.of("id", post.getUserId(), "username", "Unknown User")));

            return dto;
        }).toList();

        return ResponseEntity.ok(result);
    }

    // POST /api/posts
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Map<String, Object> body,
                                           @AuthenticationPrincipal Jwt jwt) {
        String userId = userService.syncUser(jwt).getId();

        ObjectMapper mapper = new ObjectMapper();
        String imagesJson = null;
        if (body.get("images") != null) {
            try {
                imagesJson = mapper.writeValueAsString(body.get("images"));
            } catch (Exception e) {}
        }

        Post post = Post.builder()
            .userId(userId)
            .title((String) body.get("title"))
            .body((String) body.get("body"))
            .location((String) body.get("location"))
            .images(imagesJson)
            .build();

        return ResponseEntity.ok(postRepository.save(post));
    }

    // DELETE /api/posts/:id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id,
                                           @AuthenticationPrincipal Jwt jwt) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUserId().equals(jwt.getSubject())) {
            return ResponseEntity.status(403).build();
        }

        postRepository.delete(post);
        return ResponseEntity.noContent().build();
    }

    // POST /api/posts/:id/like
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable String id,
                                                           @AuthenticationPrincipal Jwt jwt) {
        String userId = userService.syncUser(jwt).getId();
        Optional<PostLike> existing = postLikeRepository.findByPostIdAndUserId(id, userId);

        boolean liked;
        if (existing.isPresent()) {
            postLikeRepository.delete(existing.get());
            liked = false;
        } else {
            Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
            PostLike like = PostLike.builder().post(post).userId(userId).build();
            postLikeRepository.save(like);
            liked = true;
        }

        return ResponseEntity.ok(Map.of(
            "liked", liked,
            "likesCount", postLikeRepository.countByPostId(id)
        ));
    }

    // POST /api/posts/:id/comments
    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable String id,
                                              @RequestBody Map<String, String> body,
                                              @AuthenticationPrincipal Jwt jwt) {
        String userId = userService.syncUser(jwt).getId();
        Post post = postRepository.findById(id).orElseThrow();
        Comment comment = Comment.builder()
                .post(post)
                .userId(userId)
                .content(body.get("content"))
                .build();
        return ResponseEntity.ok(commentRepository.save(comment));
    }
}
