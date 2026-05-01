-- Add weather_logs table for storing 7-day weather history per farm
CREATE TABLE IF NOT EXISTS public.weather_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid REFERENCES public.farms(id) ON DELETE CASCADE,
  district text NOT NULL,
  temperature numeric NOT NULL,
  humidity numeric NOT NULL,
  wind_speed numeric NOT NULL,
  description text NOT NULL,
  precipitation numeric DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_weather_logs_farm_id ON public.weather_logs(farm_id);
CREATE INDEX IF NOT EXISTS idx_weather_logs_recorded_at ON public.weather_logs(recorded_at);
CREATE INDEX IF NOT EXISTS idx_weather_logs_farm_date ON public.weather_logs(farm_id, recorded_at DESC);

-- Enable RLS
ALTER TABLE public.weather_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view weather logs for their farms"
  ON public.weather_logs FOR SELECT
  TO authenticated
  USING (
    farm_id IN (
      SELECT id FROM public.farms WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert weather logs for their farms"
  ON public.weather_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    farm_id IN (
      SELECT id FROM public.farms WHERE user_id = auth.uid()
    )
  );

-- Add some sample data for testing
INSERT INTO public.weather_logs (farm_id, district, temperature, humidity, wind_speed, description, precipitation)
SELECT
  f.id,
  f.location,
  28 + (random() * 10)::int,
  60 + (random() * 20)::int,
  5 + (random() * 10)::int,
  'partly cloudy',
  (random() * 30)::int
FROM public.farms f
WHERE f.created_at >= now() - interval '7 days'
ON CONFLICT DO NOTHING;
