import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiGet } from '@/lib/httpClient';
import { cropRecommender } from '@/lib/ai/cropRecommender';
import { WeatherAPI } from '@/lib/api/weather';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CardShimmer, CropCardShimmer } from '@/components/ui/loading-shimmer';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/animations';
import { LottieEmptyState } from '@/components/ui/lottie-loading';
import { Sprout, TrendingUp, Users, FileText, Cloud, Leaf, MapPin, Zap, Droplets, Thermometer } from 'lucide-react';

interface Crop {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  investmentPerAcre?: number;
  expectedReturns?: number;
  breakevenMonths?: number;
  durationDays?: number;
  season?: string;
  weatherPattern?: string;
}

interface CropRecommendation {
  cropName: string;
  reason: string;
  season: string;
  expectedYield: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  forecast: Array<{
    date: string;
    temp_max: number;
    temp_min: number;
    description: string;
    precipitation: number;
  }>;
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [districts, setDistricts] = useState<string[]>([]);
  const [districtData, setDistrictData] = useState<any[]>([]);
  const [cropRecommendations, setCropRecommendations] = useState<CropRecommendation[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [newsItems, setNewsItems] = useState<string[]>([]);


  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    initializeDashboard();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedDistrict) {
      loadDistrictData();
    }
  }, [selectedDistrict]);

  const loadDistrictDataFromCSV = async () => {
    try {
      const response = await fetch('/districts.csv');
      const csvText = await response.text();
      const lines = csvText.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',');
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim();
        });
        return obj;
      });
      setDistrictData(data);
      setDistricts(data.map(d => d.district));
    } catch (error) {
      console.error('Error loading district data:', error);
    }
  };

  const initializeDashboard = async () => {
    try {
      // Load districts from CSV
      await loadDistrictDataFromCSV();

      // Set default district from profile or first available
      const defaultDistrict = profile?.location || districts[0] || '';
      setSelectedDistrict(defaultDistrict);

      // Load crops
      const data = await apiGet('/api/crops?limit=6');
      setCrops(data || []);



      // Load news items (mock for now)
      setNewsItems([
        'New subsidy scheme announced for organic farming',
        'Weather alert: Heavy rainfall expected in coastal districts',
        'New pest-resistant rice variety released',
        'Farmers training program starting next month'
      ]);
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDistrictData = async () => {
    if (!selectedDistrict) return;

    try {
      // Load crop recommendations from AI
      const recommendations = await cropRecommender.getRecommendations(selectedDistrict);
      setCropRecommendations(recommendations);

      // Load specific crop details for the district (Recommended Crops)
      setLoading(true);
      let data = await apiGet(`/api/crops/recommendations/${encodeURIComponent(selectedDistrict)}`);
      
      // Fallback to all crops if no recommendations found for this district
      if (!data || data.length === 0) {
        data = await apiGet('/api/crops?limit=6');
      }
      
      setCrops(data || []);

      // Load weather data
      const weatherRes = await WeatherAPI.getWeatherForDistrict(selectedDistrict);
      if (weatherRes) {
        setWeatherData(weatherRes.weather);
      }
    } catch (error) {
      console.error('Error loading district data:', error);
    } finally {
      setLoading(false);
    }
  };



  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Welcome back, {profile?.full_name || profile?.username || 'Farmer'}!
            </h1>
            <p className="text-gray-600 mt-2">
              {profile?.location
                ? `Farming from ${profile.location}`
                : 'Manage your farming activities and stay updated'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.sort().map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>



        {selectedDistrict && (
          <ScrollReveal direction="up" delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weather Card */}
              <Card className="card-mobile">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cloud className="h-5 w-5 mr-2 text-blue-600" />
                    Weather in {selectedDistrict}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {weatherData ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <span className="text-2xl font-bold">{weatherData.temperature}°C</span>
                        </div>
                        <Badge variant="secondary">{weatherData.description}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span>Humidity: {weatherData.humidity}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Cloud className="h-4 w-4 text-gray-500" />
                          <span>Wind: {weatherData.windSpeed} km/h</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">5-Day Forecast</h4>
                        <div className="space-y-2">
                          {weatherData.forecast.slice(0, 3).map((day, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                              <span>{day.temp_min}° - {day.temp_max}°</span>
                              <span>{day.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <CardShimmer />
                  )}
                </CardContent>
              </Card>

              {/* Crop Recommendations Card */}
              <Card className="card-mobile">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Leaf className="h-5 w-5 mr-2 text-green-600" />
                    Recommended Crops for {selectedDistrict}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cropRecommendations.length > 0 ? (
                    <div className="space-y-4">
                      {cropRecommendations.slice(0, 4).map((rec, index) => {
                        const districtInfo = districtData.find(d => d.district === selectedDistrict);
                        const recommendedCrops = districtInfo?.recommended_crops?.split(' / ') || [];
                        const isRecommended = recommendedCrops.includes(rec.cropName);

                        return (
                          <div key={index} className="border rounded-lg p-4 bg-green-50/50">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-green-800 text-lg">{rec.cropName}</h4>
                              <div className="flex gap-2">
                                {isRecommended && <Badge variant="default" className="bg-green-600">Recommended</Badge>}
                                <Badge variant="outline">{rec.season}</Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                            <p className="text-sm text-green-600 font-medium mb-3">Expected: {rec.expectedYield}</p>

                            {/* District-specific information from CSV */}
                            {districtInfo && (
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">Soil Type:</span>
                                  <p className="text-gray-600 mt-1">{districtInfo.soil_type}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Average Rainfall:</span>
                                  <p className="text-gray-600 mt-1">{districtInfo.avg_rainfall}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Weather Pattern:</span>
                                  <p className="text-gray-600 mt-1">{districtInfo.weather_pattern}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <CardShimmer />
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        )}



        <ScrollReveal direction="up" delay={0.2}>
          <div>
            <h2 className="text-2xl font-bold mb-4">Popular Crops</h2>
            {loading ? (
              <CropCardShimmer count={6} />
            ) : crops.length > 0 ? (
              <StaggerContainer staggerDelay={0.05}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {crops.map((crop) => (
                    <StaggerItem key={crop.id}>
                      <Card
                        className="card-hover cursor-pointer overflow-hidden group card-mobile border-none shadow-premium bg-white"
                        onClick={() => navigate(`/crop/${crop.name.toLowerCase()}`)}
                      >
                        {crop.image_url && (
                          <div className="h-48 overflow-hidden relative">
                            <img
                              src={crop.image_url}
                              alt={crop.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute top-4 right-4 capitalize">
                              <Badge className="bg-white/90 text-green-700 hover:bg-white border-none shadow-sm backdrop-blur-sm">
                                {crop.season || 'Annual'}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <CardTitle className="flex justify-between items-center text-xl text-green-800 font-bold">
                            <div className="flex items-center">
                              <Leaf className="h-5 w-5 mr-2 text-green-600" />
                              {crop.name}
                            </div>
                          </CardTitle>
                          <CardDescription className="flex items-center text-gray-500 font-medium">
                            {crop.durationDays ? `${crop.durationDays} Days Duration` : crop.category}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Financial Info modeled after the reference image */}
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex flex-col gap-1 p-3 bg-green-50/50 rounded-xl border border-green-100/50">
                              <div className="text-[10px] uppercase tracking-wider text-green-600 font-bold opacity-80">Investment Required</div>
                              <div className="text-sm font-bold text-gray-800">
                                {crop.investmentPerAcre ? `₹${crop.investmentPerAcre.toLocaleString()}` : '₹35,000-45,000'} <span className="text-[10px] text-gray-500 font-normal">per acre</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                              <div className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold opacity-80">Expected Returns</div>
                              <div className="text-sm font-bold text-gray-800">
                                {crop.expectedReturns ? `₹${crop.expectedReturns.toLocaleString()}` : '₹55,000-70,000'} <span className="text-[10px] text-gray-500 font-normal">per acre</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                              <div className="flex items-center text-xs text-gray-600">
                                <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                                <span className="font-semibold">Break-even:</span>
                              </div>
                              <div className="text-xs font-bold text-gray-800">
                                {crop.breakevenMonths ? `${crop.breakevenMonths} Months` : '4 Months'}
                              </div>
                            </div>
                          </div>

                          <Button className="w-full btn-primary bg-green-600 hover:bg-green-700 text-white shadow-soft rounded-lg py-5 transition-all active:scale-[0.98]">
                            View Detailed Analysis
                          </Button>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            ) : (
              <LottieEmptyState message="No crops available at the moment" />
            )}
          </div>
        </ScrollReveal>

        {/* District-wise Crop Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Crops by District</CardTitle>
            <CardDescription>
              Overview of recommended crops for all districts in Karnataka
            </CardDescription>
          </CardHeader>
          <CardContent>
            {districtData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {districtData.map((district, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-green-50/50 hover:bg-green-100/50 transition-colors">
                    <h4 className="font-semibold text-green-800 mb-2">{district.district}</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Recommended Crops:</span>
                        <p className="text-gray-600">{district.recommended_crops}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Soil Type:</span>
                        <p className="text-gray-600">{district.soil_type}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Avg Rainfall:</span>
                        <p className="text-gray-600">{district.avg_rainfall}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Weather:</span>
                        <p className="text-gray-600">{district.weather_pattern}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <CardShimmer />
            )}
          </CardContent>
        </Card>

        {/* News Section */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Agricultural News</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {newsItems.map((news, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{news}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <ScrollReveal direction="up" delay={0.3}>
          <Card className="bg-gradient-to-r from-leaf-500 to-emerald-500 text-white border-none shadow-soft-lg">
            <CardHeader>
              <CardTitle className="text-white">Need Help?</CardTitle>
              <CardDescription className="text-white/90">
                Our AI assistant and agricultural experts are here to assist you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/air-agent')}
                  className="bg-white text-leaf-700 hover:bg-leaf-50 active:scale-95 transition-all duration-200"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Ask AI Assistant
                </Button>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </Layout>
  );
}
