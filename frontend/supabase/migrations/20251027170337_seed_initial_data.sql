/*
  # Seed Initial Data for Agri Compass

  1. Seed Data
    - Add common crops with details
    - Add sample government schemes
    - Add sample market prices

  This migration provides initial data to make the application functional immediately.
*/

-- Insert common crops
INSERT INTO crops (name, category, season, duration_days, description, image_url) VALUES
  ('Rice', 'Cereal', 'Kharif', 120, 'Staple food crop grown in flooded fields', 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg'),
  ('Wheat', 'Cereal', 'Rabi', 120, 'Winter crop, major cereal grain', 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg'),
  ('Tomato', 'Vegetable', 'All Season', 90, 'Popular vegetable crop for fresh market and processing', 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'),
  ('Potato', 'Vegetable', 'Rabi', 90, 'Tuber crop, versatile vegetable', 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg'),
  ('Onion', 'Vegetable', 'Rabi', 120, 'Bulb crop, essential for cooking', 'https://images.pexels.com/photos/1359325/pexels-photo-1359325.jpeg'),
  ('Cotton', 'Cash Crop', 'Kharif', 180, 'Fiber crop for textile industry', 'https://images.pexels.com/photos/6129002/pexels-photo-6129002.jpeg'),
  ('Sugarcane', 'Cash Crop', 'All Season', 365, 'Long duration crop for sugar production', 'https://images.pexels.com/photos/2889491/pexels-photo-2889491.jpeg'),
  ('Maize', 'Cereal', 'Kharif', 90, 'Corn, used for food and feed', 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg'),
  ('Soybean', 'Pulse', 'Kharif', 90, 'Oil seed and protein crop', 'https://images.pexels.com/photos/2589457/pexels-photo-2589457.jpeg'),
  ('Mustard', 'Oilseed', 'Rabi', 120, 'Oilseed crop for cooking oil', 'https://images.pexels.com/photos/14277543/pexels-photo-14277543.jpeg')
ON CONFLICT (name) DO NOTHING;

-- Insert sample government schemes
INSERT INTO government_schemes (name, description, eligibility, benefits, application_process, contact_info, state, category, active) VALUES
  (
    'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    'Direct income support to farmers providing ₹6000 per year in three equal installments',
    'All landholding farmers (subject to certain exclusions)',
    '₹6000 per year in three installments of ₹2000 each, directly transferred to bank accounts',
    'Register online at pmkisan.gov.in or through local agriculture offices',
    'Helpline: 155261 / 011-24300606, Email: pmkisan-ict@gov.in',
    'All India',
    'Financial Support',
    true
  ),
  (
    'Soil Health Card Scheme',
    'Provides soil health cards to farmers with recommendations for nutrient management',
    'All farmers across the country',
    'Free soil testing and personalized recommendations for optimal fertilizer use',
    'Contact your nearest Krishi Vigyan Kendra or agriculture department',
    'Contact local agriculture department',
    'All India',
    'Soil Management',
    true
  ),
  (
    'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    'Crop insurance scheme providing financial support against crop loss',
    'All farmers including sharecroppers and tenant farmers',
    'Low premium rates, coverage for natural calamities, pests, and diseases',
    'Apply through banks, cooperative societies, or online at pmfby.gov.in',
    'Helpline: 011-23382012, Website: pmfby.gov.in',
    'All India',
    'Insurance',
    true
  ),
  (
    'Kisan Credit Card (KCC)',
    'Provides adequate and timely credit to farmers for agriculture and allied activities',
    'Farmers with cultivable land, tenant farmers, and self-help groups',
    'Credit facility up to ₹3 lakhs at 7% interest rate (4% with prompt repayment)',
    'Apply at any bank branch with land documents and identity proof',
    'Contact nearest bank branch',
    'All India',
    'Credit',
    true
  ),
  (
    'National Mission for Sustainable Agriculture (NMSA)',
    'Promotes sustainable agriculture practices and improves farm productivity',
    'All farmers',
    'Support for organic farming, soil health management, and resource conservation',
    'Contact state agriculture department or nearest Krishi Vigyan Kendra',
    'Contact state agriculture department',
    'All India',
    'Sustainability',
    true
  ),
  (
    'Paramparagat Krishi Vikas Yojana (PKVY)',
    'Promotes organic farming and certification',
    'Groups of farmers willing to adopt organic farming',
    '₹50,000 per hectare over 3 years for organic inputs and certification',
    'Form groups of 50 farmers and apply through state agriculture department',
    'Contact state agriculture department',
    'All India',
    'Organic Farming',
    true
  ),
  (
    'National Agriculture Market (e-NAM)',
    'Online trading platform for agricultural commodities',
    'Registered farmers and traders',
    'Better price discovery, transparent transactions, reduced transaction costs',
    'Register at enam.gov.in with required documents',
    'Helpline: 1800-270-0224, Website: enam.gov.in',
    'All India',
    'Marketing',
    true
  ),
  (
    'PM Kusum Yojana',
    'Provides solar pumps and grid-connected solar power plants for farmers',
    'All farmers',
    'Subsidy for solar pumps, additional income from selling surplus power',
    'Apply through state nodal agencies or DISCOM offices',
    'Contact state renewable energy department',
    'All India',
    'Energy',
    true
  )
ON CONFLICT DO NOTHING;

-- Insert sample market prices (recent data)
INSERT INTO market_prices (crop_id, location, price_per_unit, unit, market_name, date)
SELECT 
  c.id,
  location,
  price,
  'Quintal',
  market,
  CURRENT_DATE
FROM crops c
CROSS JOIN (VALUES
  ('Delhi', 2850, 'Azadpur Mandi'),
  ('Mumbai', 3200, 'Vashi APMC'),
  ('Bangalore', 2950, 'Yeshwanthpur APMC'),
  ('Kolkata', 2700, 'Posta Market'),
  ('Chennai', 2900, 'Koyambedu Market')
) AS prices(location, price, market)
WHERE c.name = 'Rice'

UNION ALL

SELECT 
  c.id,
  location,
  price,
  'Quintal',
  market,
  CURRENT_DATE
FROM crops c
CROSS JOIN (VALUES
  ('Delhi', 2650, 'Azadpur Mandi'),
  ('Mumbai', 2850, 'Vashi APMC'),
  ('Bangalore', 2700, 'Yeshwanthpur APMC'),
  ('Kolkata', 2500, 'Posta Market'),
  ('Chennai', 2600, 'Koyambedu Market')
) AS prices(location, price, market)
WHERE c.name = 'Wheat'

UNION ALL

SELECT 
  c.id,
  location,
  price,
  'Quintal',
  market,
  CURRENT_DATE
FROM crops c
CROSS JOIN (VALUES
  ('Delhi', 1800, 'Azadpur Mandi'),
  ('Mumbai', 2200, 'Vashi APMC'),
  ('Bangalore', 2000, 'Yeshwanthpur APMC'),
  ('Kolkata', 1750, 'Posta Market'),
  ('Chennai', 1950, 'Koyambedu Market')
) AS prices(location, price, market)
WHERE c.name = 'Tomato'

UNION ALL

SELECT 
  c.id,
  location,
  price,
  'Quintal',
  market,
  CURRENT_DATE
FROM crops c
CROSS JOIN (VALUES
  ('Delhi', 1500, 'Azadpur Mandi'),
  ('Mumbai', 1700, 'Vashi APMC'),
  ('Bangalore', 1600, 'Yeshwanthpur APMC'),
  ('Kolkata', 1400, 'Posta Market'),
  ('Chennai', 1550, 'Koyambedu Market')
) AS prices(location, price, market)
WHERE c.name = 'Potato'

UNION ALL

SELECT 
  c.id,
  location,
  price,
  'Quintal',
  market,
  CURRENT_DATE
FROM crops c
CROSS JOIN (VALUES
  ('Delhi', 2500, 'Azadpur Mandi'),
  ('Mumbai', 2800, 'Vashi APMC'),
  ('Bangalore', 2650, 'Yeshwanthpur APMC'),
  ('Kolkata', 2400, 'Posta Market'),
  ('Chennai', 2550, 'Koyambedu Market')
) AS prices(location, price, market)
WHERE c.name = 'Onion';