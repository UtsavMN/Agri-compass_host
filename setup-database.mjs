import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://agri-compass-utsavmn.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU1NDM4MjAsImlkIjoiMDE5ZDI5OGUtOTkwMS03OTE3LWI5YmMtMmY3NDBmMDQ2YjAyIiwicmlkIjoiY2MwZDMwMWItYzM1MS00YmUyLWE4ZTYtNzIwZDBjMzJjNWEzIn0.YRmwbBpfX_E5lMNixQh9aHOatJZJa89w3MyUb2naD8I_NTHt6q5SHSCqAVvgXoK2SaK5y3iaY9adlfKplw5gCg',
});

const statements = [
  // ===================== USERS =====================
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // ===================== PROFILES =====================
  `CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    district TEXT,
    preferences TEXT,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    language_preference TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  )`,

  // ===================== PASSWORD RESET TOKENS =====================
  `CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    used INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // ===================== POSTS =====================
  `CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT,
    body TEXT,
    crop_tags TEXT,
    location TEXT,
    images TEXT,
    video_url TEXT,
    kn_caption TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // ===================== POST LIKES =====================
  `CREATE TABLE IF NOT EXISTS post_likes (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE(post_id, user_id)
  )`,

  // ===================== COMMENTS =====================
  `CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  )`,

  // ===================== FARMS =====================
  `CREATE TABLE IF NOT EXISTS farms (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    area_acres REAL,
    soil_type TEXT,
    irrigation_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // ===================== WEATHER LOGS =====================
  `CREATE TABLE IF NOT EXISTS weather_logs (
    id TEXT PRIMARY KEY,
    farm_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    notes TEXT,
    temperature REAL,
    humidity REAL,
    conditions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
  )`,

  // ===================== FARM IMAGES =====================
  `CREATE TABLE IF NOT EXISTS farm_images (
    id TEXT PRIMARY KEY,
    farm_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
  )`,

  // ===================== CROPS =====================
  `CREATE TABLE IF NOT EXISTS crops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    district TEXT,
    season TEXT,
    duration_days INTEGER,
    investment_per_acre REAL,
    expected_returns REAL,
    breakeven_months INTEGER,
    soil_type TEXT,
    rainfall_mm TEXT,
    weather_pattern TEXT,
    guidelines TEXT,
    image_url TEXT
  )`,

  // ===================== CROP ECONOMICS =====================
  `CREATE TABLE IF NOT EXISTS crop_economics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop_id INTEGER NOT NULL,
    investment_per_acre REAL,
    yield_quintal_per_acre REAL,
    market_price_per_quintal REAL,
    expected_return REAL,
    profit_margin REAL,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
  )`,

  // ===================== CROP RECOMMENDATIONS =====================
  `CREATE TABLE IF NOT EXISTS crop_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    district TEXT NOT NULL,
    crop_id INTEGER NOT NULL,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
  )`,

  // ===================== INDEXES =====================
  `CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_profiles_district ON profiles(district)`,
  `CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_posts_location ON posts(location)`,
  `CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id)`,
  `CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id)`,
  `CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_weather_logs_farm_id ON weather_logs(farm_id)`,
  `CREATE INDEX IF NOT EXISTS idx_farm_images_farm_id ON farm_images(farm_id)`,
  `CREATE INDEX IF NOT EXISTS idx_crop_recommendations_district ON crop_recommendations(district)`,
  `CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id)`,

  // ===================== SEED: CROPS DATA =====================
  `INSERT OR IGNORE INTO crops (id, name, district, season, duration_days, investment_per_acre, expected_returns, breakeven_months, soil_type, rainfall_mm, weather_pattern, guidelines, image_url)
   VALUES
   (1, 'Rice', 'Mysuru', 'Kharif', 150, 40000, 80000, 5, 'Alluvial, Clay, Loamy', '1200-1500', 'Monsoon', 'Deep ploughing and leveling required.\nPuddling before transplanting.\nFlood irrigation during vegetative phase.\nDrain field 15 days before harvest.\nApply DAP 50kg and Urea 25kg per acre basal dose.\nTop dress Urea 50kg at tillering and panicle stages.\nMonitor for blast disease and BPH pests.\nHarvest when 80% grains turn golden.', 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg'),
   
   (2, 'Wheat', 'Belagavi', 'Rabi', 130, 35000, 70000, 4, 'Loamy, Clay loam', '450-650', 'Winter dry', 'Ploughing, harrowing, and leveling before sowing.\nLine sowing with 20cm row spacing at 40-50kg seed per acre.\nSeed treatment with Vitavax before sowing.\n4-6 irrigations during growing period.\nCritical irrigation at crown root, tillering, flowering.\nApply DAP 60kg basal and Urea 40kg at CRI and flowering.\nHarvest with combine when moisture below 12%.', 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg'),
   
   (3, 'Tomato', 'Kolar', 'All Seasons', 120, 70000, 150000, 4, 'Well-drained loamy', '600-800', 'Moderate rainfall', 'Deep ploughing with FYM incorporation.\nTransplant 25-30 day seedlings at 60cm x 45cm spacing.\nDrip irrigation recommended for water efficiency.\nApply NPK 100kg per acre as basal.\nWeekly fertigation through drip system.\nStake plants for better fruit quality.\nSpray for early blight and fruit borer.\nHarvest at red ripe stage for fresh market.', 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'),
   
   (4, 'Ragi (Finger Millet)', 'Tumakuru', 'Kharif', 120, 20000, 45000, 4, 'Red laterite, Sandy loam', '500-800', 'Semi-arid', 'Prepare land with 2-3 ploughings.\nTransplant 20-25 day old seedlings.\nSpacing 30cm x 10cm.\nApply FYM 5 tonnes per acre before planting.\nIrrigate at 7-10 day intervals.\nWeed at 20 and 40 days after planting.\nHarvest when earheads turn brown.\nDry and thresh to separate grains.', 'https://images.pexels.com/photos/4917014/pexels-photo-4917014.jpeg'),
   
   (5, 'Sugarcane', 'Mandya', 'Annual', 365, 80000, 200000, 12, 'Deep loamy, Black cotton', '1500-2000', 'Tropical humid', 'Deep ploughing and ridging at 90cm spacing.\nPlant 3-bud setts treated with fungicide.\nFurrow irrigation every 7-10 days.\nApply 100kg Urea in 3 split doses.\nEarthing up at 90 and 120 days.\nDe-trashing lower dry leaves monthly.\nIntercrop with pulses in early stages.\nHarvest at 10-12 months when brix reaches 18-20%.', 'https://images.pexels.com/photos/2305097/pexels-photo-2305097.jpeg'),
   
   (6, 'Coconut', 'Dakshina Kannada', 'Perennial', 1825, 50000, 120000, 60, 'Laterite, Sandy loam, Red loam', '1500-3000', 'Coastal humid', 'Dig pits 1m x 1m x 1m at 7.5m spacing.\nFill with topsoil, FYM, and bone meal.\nPlant 10-12 month old seedlings.\nBasin irrigation twice a week in summer.\nApply NPK 500g:300g:1000g per palm per year.\nHusk burial in basins for moisture retention.\nWatch for rhinoceros beetle and red palm weevil.\nFirst harvest from 5th year onwards.', 'https://images.pexels.com/photos/1835712/pexels-photo-1835712.jpeg'),
   
   (7, 'Arecanut', 'Shivamogga', 'Perennial', 2190, 60000, 150000, 72, 'Red laterite, Well-drained loam', '1500-3500', 'Western Ghats humid', 'Pit planting at 2.7m x 2.7m spacing.\nMulch with arecanut leaves.\nSprinkler or drip irrigation in dry season.\nApply NPK 100:40:140g per palm.\nWatch for fruit rot (Koleroga) during monsoon.\nSpray Bordeaux mixture preventively.\nIntercrop with pepper, cocoa, or banana.\nHarvest ripe nuts and process (tender or ripe).', 'https://images.pexels.com/photos/6152263/pexels-photo-6152263.jpeg'),
   
   (8, 'Cotton', 'Dharwad', 'Kharif', 180, 30000, 65000, 6, 'Black cotton, Medium black', '600-1000', 'Semi-arid to sub-humid', 'Deep ploughing after rains.\nSow Bt cotton at 90cm x 60cm spacing.\n3-4 irrigations at critical stages.\nApply DAP 50kg basal, Urea 40kg top dress.\nRefugium planting (non-Bt) mandatory at 20%.\nIPM for bollworm management.\nPick cotton in 3-4 pickings when bolls burst.\nGrade and sell to CCI or ginning mills.', 'https://images.pexels.com/photos/3490362/pexels-photo-3490362.jpeg'),
   
   (9, 'Maize', 'Davanagere', 'Kharif', 110, 25000, 55000, 4, 'Well-drained loamy, Alluvial', '500-800', 'Semi-arid monsoon', 'Prepare fine tilth seedbed.\nSow at 60cm x 20cm spacing, 8kg seed/acre.\nSeed treatment with Thiram.\nIrrigate at tasseling and grain filling stages.\nApply 50kg DAP basal, 50kg Urea in 2 splits.\nWatch for Fall Armyworm - spray Emamectin.\nHarvest when husks dry and kernels dent.\nDry cobs to 14% moisture before storage.', 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg'),
   
   (10, 'Groundnut', 'Chitradurga', 'Kharif', 120, 25000, 60000, 4, 'Sandy loam, Red sandy', '400-600', 'Semi-arid', 'Plough and level field after pre-monsoon rains.\nSow kernels at 30cm x 10cm spacing.\nSeed treatment with Rhizobium culture.\nApply gypsum 200kg/acre at flowering.\nEarthingup at 35-40 days.\nIrrigate at pegging and pod development.\nHarvest when leaves yellow and inner shell darkens.\nDry pods to 8-10% moisture for storage.', 'https://images.pexels.com/photos/4917834/pexels-photo-4917834.jpeg')`,

  // ===================== SEED: CROP RECOMMENDATIONS =====================
  `INSERT OR IGNORE INTO crop_recommendations (id, district, crop_id) VALUES
   (1, 'Mysuru', 1), (2, 'Mysuru', 4), (3, 'Mysuru', 6),
   (4, 'Belagavi', 2), (5, 'Belagavi', 9), (6, 'Belagavi', 3),
   (7, 'Kolar', 3), (8, 'Kolar', 10), (9, 'Kolar', 4),
   (10, 'Tumakuru', 4), (11, 'Tumakuru', 10), (12, 'Tumakuru', 9),
   (13, 'Mandya', 5), (14, 'Mandya', 1), (15, 'Mandya', 4),
   (16, 'Dakshina Kannada', 6), (17, 'Dakshina Kannada', 7),
   (18, 'Shivamogga', 7), (19, 'Shivamogga', 6), (20, 'Shivamogga', 1),
   (21, 'Dharwad', 8), (22, 'Dharwad', 9), (23, 'Dharwad', 2),
   (24, 'Davanagere', 9), (25, 'Davanagere', 5), (26, 'Davanagere', 10),
   (27, 'Chitradurga', 10), (28, 'Chitradurga', 9), (29, 'Chitradurga', 4),
   (30, 'Bengaluru Urban', 3), (31, 'Bengaluru Urban', 4), (32, 'Bengaluru Urban', 1),
   (33, 'Bengaluru Rural', 1), (34, 'Bengaluru Rural', 4), (35, 'Bengaluru Rural', 10),
   (36, 'Hassan', 1), (37, 'Hassan', 6), (38, 'Hassan', 4),
   (39, 'Kodagu', 6), (40, 'Kodagu', 7),
   (41, 'Udupi', 6), (42, 'Udupi', 7), (43, 'Udupi', 1),
   (44, 'Uttara Kannada', 1), (45, 'Uttara Kannada', 7), (46, 'Uttara Kannada', 6),
   (47, 'Haveri', 9), (48, 'Haveri', 8), (49, 'Haveri', 2),
   (50, 'Gadag', 2), (51, 'Gadag', 8), (52, 'Gadag', 10),
   (53, 'Koppal', 1), (54, 'Koppal', 9), (55, 'Koppal', 10),
   (56, 'Raichur', 1), (57, 'Raichur', 8), (58, 'Raichur', 9),
   (59, 'Ballari', 8), (60, 'Ballari', 9), (61, 'Ballari', 10),
   (62, 'Vijayapura', 2), (63, 'Vijayapura', 10), (64, 'Vijayapura', 8),
   (65, 'Bagalkot', 2), (66, 'Bagalkot', 5), (67, 'Bagalkot', 10),
   (68, 'Kalaburagi', 2), (69, 'Kalaburagi', 8), (70, 'Kalaburagi', 10),
   (71, 'Bidar', 2), (72, 'Bidar', 5), (73, 'Bidar', 10),
   (74, 'Yadgir', 1), (75, 'Yadgir', 8), (76, 'Yadgir', 10),
   (77, 'Ramanagara', 1), (78, 'Ramanagara', 4), (79, 'Ramanagara', 6),
   (80, 'Chikkaballapur', 3), (81, 'Chikkaballapur', 10), (82, 'Chikkaballapur', 4),
   (83, 'Chamarajanagar', 1), (84, 'Chamarajanagar', 5), (85, 'Chamarajanagar', 4),
   (86, 'Chikkamagaluru', 7), (87, 'Chikkamagaluru', 6), (88, 'Chikkamagaluru', 1),
   (89, 'Vijayanagara', 9), (90, 'Vijayanagara', 10), (91, 'Vijayanagara', 1)`
];

async function main() {
  console.log('🌱 Starting Agri Compass database schema creation...\n');

  for (let i = 0; i < statements.length; i++) {
    const sql = statements[i].trim();
    const label = sql.substring(0, 60).replace(/\n/g, ' ');
    try {
      await db.execute(sql);
      console.log(`✅ [${i + 1}/${statements.length}] ${label}...`);
    } catch (err) {
      console.error(`❌ [${i + 1}/${statements.length}] FAILED: ${label}...`);
      console.error(`   Error: ${err.message}\n`);
    }
  }

  // Verify tables
  console.log('\n📋 Verifying created tables...');
  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('\nTables in database:');
  tables.rows.forEach(row => console.log(`  📦 ${row.name}`));

  // Verify crop count
  const cropCount = await db.execute("SELECT COUNT(*) as count FROM crops");
  console.log(`\n🌾 Total crops seeded: ${cropCount.rows[0].count}`);

  const recCount = await db.execute("SELECT COUNT(*) as count FROM crop_recommendations");
  console.log(`📍 Total crop recommendations: ${recCount.rows[0].count}`);

  console.log('\n✨ Database setup complete!');
}

main().catch(console.error);
