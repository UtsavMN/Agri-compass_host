-- Enhance farms module with additional features

-- Create farm_weather_logs table for weather notes
CREATE TABLE IF NOT EXISTS public.farm_weather_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  notes TEXT NOT NULL,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  conditions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create farm_images table for farm photos
CREATE TABLE IF NOT EXISTS public.farm_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE farm_weather_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_images ENABLE ROW LEVEL SECURITY;

-- Weather logs policies
CREATE POLICY "Users can view weather logs for their farms"
  ON farm_weather_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create weather logs for their farms"
  ON farm_weather_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weather logs"
  ON farm_weather_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weather logs"
  ON farm_weather_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Farm images policies
CREATE POLICY "Users can view images for their farms"
  ON farm_images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload images for their farms"
  ON farm_images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farm images"
  ON farm_images FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farm images"
  ON farm_images FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for farm media
INSERT INTO storage.buckets (id, name, public)
VALUES ('farm-media', 'farm-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for farm-media bucket
CREATE POLICY "Users can upload farm media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'farm-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view farm media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'farm-media');

CREATE POLICY "Users can update their own farm media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'farm-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own farm media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'farm-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_farm_weather_logs_farm_id ON farm_weather_logs(farm_id);
CREATE INDEX IF NOT EXISTS idx_farm_weather_logs_created_at ON farm_weather_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_farm_images_farm_id ON farm_images(farm_id);
CREATE INDEX IF NOT EXISTS idx_farm_images_created_at ON farm_images(created_at DESC);

-- Function to get farm duration in days
CREATE OR REPLACE FUNCTION get_farm_duration(farm_created_at TIMESTAMPTZ)
RETURNS INTEGER AS $$
BEGIN
  RETURN EXTRACT(EPOCH FROM (NOW() - farm_created_at)) / 86400;
END;
$$ LANGUAGE plpgsql;

-- Function to get next steps based on current month
CREATE OR REPLACE FUNCTION get_farm_next_steps(current_month INTEGER, crop_type TEXT DEFAULT NULL)
RETURNS TEXT[] AS $$
DECLARE
  steps TEXT[];
BEGIN
  CASE current_month
    WHEN 1, 2, 3 THEN -- Winter/Spring
      steps := ARRAY[
        'Prepare soil for spring planting',
        'Check irrigation systems',
        'Plan crop rotation',
        'Monitor for early pests'
      ];
    WHEN 4, 5, 6 THEN -- Summer
      steps := ARRAY[
        'Plant summer crops',
        'Implement pest control measures',
        'Monitor soil moisture levels',
        'Prepare for monsoon season'
      ];
    WHEN 7, 8, 9 THEN -- Monsoon
      steps := ARRAY[
        'Protect crops from excessive rain',
        'Monitor for fungal diseases',
        'Ensure proper drainage',
        'Harvest ready crops'
      ];
    WHEN 10, 11, 12 THEN -- Autumn/Winter
      steps := ARRAY[
        'Harvest remaining crops',
        'Prepare fields for winter',
        'Plan next season crops',
        'Maintain farm equipment'
      ];
    ELSE
      steps := ARRAY['General farm maintenance'];
  END CASE;

  RETURN steps;
END;
$$ LANGUAGE plpgsql;
