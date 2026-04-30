package com.agricompass.api.service;

import com.agricompass.api.entity.User;
import com.agricompass.api.entity.UserProfile;
import com.agricompass.api.repository.UserRepository;
import com.agricompass.api.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Transactional
    public User syncUser(Jwt jwt) {
        String clerkId = jwt.getSubject();
        String email = jwt.getClaimAsString("email");
        String username = jwt.getClaimAsString("username");
        if (username == null) {
            username = email != null ? email.split("@")[0] : clerkId;
        }

        Optional<User> existingUser = userRepository.findById(clerkId);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update email if changed
            if (email != null && !email.equals(user.getEmail())) {
                user.setEmail(email);
                userRepository.save(user);
            }
        } else {
            // Create new user
            user = User.builder()
                    .id(clerkId)
                    .username(username)
                    .email(email != null ? email : clerkId + "@clerk.user")
                    .passwordHash("EXTERNAL_AUTH") // Placeholder since auth is external
                    .build();
            user = userRepository.save(user);

            // Create initial profile
            UserProfile profile = UserProfile.builder()
                    .id(clerkId)
                    .user(user)
                    .username(username)
                    .email(user.getEmail())
                    .fullName(jwt.getClaimAsString("name"))
                    .avatarUrl(jwt.getClaimAsString("picture"))
                    .build();
            userProfileRepository.save(profile);
        }

        return user;
    }
}
