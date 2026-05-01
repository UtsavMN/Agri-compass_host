import { supabase } from './lib/supabase.ts'

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function seedSampleData() {
  // Create a test user first
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'test123456'
  })
  
  if (authError) {
    console.error('Error creating test user:', authError)
    return
  }

  const userId = authData.user?.id

  // Create sample posts
  const samplePosts = [
    {
      user_id: userId,
      title: 'Successful Rice Harvest Tips',
      body: 'Just completed my rice harvest with great yield! Here are some key tips that worked well for me:\n\n1. Proper water management during critical growth stages\n2. Timely application of organic fertilizers\n3. Regular monitoring for pests\n4. Harvesting at the right time\n\nHappy to share more details!',
      crop_tags: ['rice', 'harvest'],
      location: 'Karnataka'
    },
    {
      user_id: userId,
      title: 'Organic Pest Control Methods',
      body: 'I\'ve been using these natural pest control methods with great success:\n\n- Neem oil spray\n- Companion planting\n- Trap crops\n- Natural predator encouragement\n\nLet me know if you want specific recipes!',
      crop_tags: ['organic', 'pestControl'],
      location: 'Coastal Karnataka'
    },
    {
      user_id: userId,
      title: 'Monsoon Crop Planning Guide',
      body: 'Planning your crops for the upcoming monsoon? Here\'s my strategy:\n\n1. Choose water-resistant varieties\n2. Prepare drainage systems\n3. Plan for crop rotation\n4. Keep disease-resistant seeds ready\n\nWhat are your monsoon planning tips?',
      crop_tags: ['monsoon', 'planning'],
      location: 'Western Ghats'
    }
  ]

  for (const post of samplePosts) {
    const { error } = await supabase
      .from('posts')
      .insert(post)
    
    if (error) {
      console.error('Error creating post:', error)
    }
  }

  console.log('Sample data seeded successfully!')
}

seedSampleData()