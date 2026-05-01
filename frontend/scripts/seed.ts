import { supabase } from './db'

async function seedDatabase() {
    console.log('Starting database seeding...')

    // Use a static user ID
    const userId = '123e4567-e89b-12d3-a456-426614174000' // This is a sample UUID

    // 2. Create sample posts
    console.log('Creating sample posts...')
    const posts = [
        {
            title: 'Rice Farming Success Story',
            body: 'After implementing new irrigation techniques, my rice yield increased by 25%! Here are the key changes I made:\n\n1. Better water management\n2. Organic fertilizers\n3. Crop rotation\n\nHas anyone else tried these methods?',
            crop_tags: ['rice', 'irrigation', 'organic'],
            location: 'Coastal Karnataka',
            user_id: userId
        },
        {
            title: 'Natural Pest Control Methods',
            body: 'These natural pest control methods have worked wonders in my farm:\n\n- Neem oil spray\n- Companion planting with marigolds\n- Beneficial insects\n\nLet\'s discuss sustainable farming!',
            crop_tags: ['organic', 'pest-control'],
            location: 'Western Ghats',
            user_id: userId
        },
        {
            title: 'Preparing for Monsoon Season',
            body: 'Monsoon preparation checklist:\n\n1. Soil testing completed\n2. Drainage systems cleaned\n3. Selected water-resistant crops\n4. Stored emergency supplies\n\nWhat are your monsoon preparations?',
            crop_tags: ['monsoon', 'planning'],
            location: 'Northern Karnataka',
            user_id: userId
        }
    ]

    for (const post of posts) {
        const { error } = await supabase
            .from('posts')
            .insert(post)

        if (error) {
            console.error('Error creating post:', error)
        }
    }

    console.log('Sample posts created!')

    // 3. Create some likes and comments
    console.log('Adding interactions...')
    const { data: allPosts } = await supabase
        .from('posts')
        .select('id')

    if (allPosts) {
        for (const post of allPosts) {
            // Add a like
            await supabase
                .from('likes')
                .insert({
                    post_id: post.id,
                    user_id: userId
                })

            // Add a comment
            await supabase
                .from('comments')
                .insert({
                    post_id: post.id,
                    user_id: userId,
                    content: 'Great insights! Thanks for sharing.'
                })
        }
    }

    console.log('Database seeding completed!')
}

seedDatabase().catch(console.error)