/**
 * Weather Page with Charts
 * Example integration of weather visualization charts
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TemperatureTrend,
  RainfallChart,
  CombinedWeatherChart,
  MiniSparkline
} from '@/components/ui/charts';
import { DistrictSearch } from '@/components/ui/district-search';
import { useDistrictSearch, loadDistrictsFromCSV, type DistrictData } from '@/hooks/useDistrictSearch';
import {
  Cloud,
  CloudRain,
  Droplets,
  Wind,
  Sun,
  Thermometer,
  Calendar,
  MapPin
} from 'lucide-react';

// Sample weather data
const weatherForecast = [
  { day: 'Mon', temp: 28, rainfall: 0, humidity: 65 },
  { day: 'Tue', temp: 30, rainfall: 5, humidity: 70 },
  { day: 'Wed', temp: 27, rainfall: 15, humidity: 80 },
  { day: 'Thu', temp: 26, rainfall: 25, humidity: 85 },
  { day: 'Fri', temp: 28, rainfall: 10, humidity: 75 },
  { day: 'Sat', temp: 29, rainfall: 0, humidity: 68 },
  { day: 'Sun', temp: 31, rainfall: 0, humidity: 62 },
];

const hourlyTemp = [25, 26, 27, 28, 29, 30, 31, 30, 29, 28, 27, 26];

const currentWeather = {
  temp: 28,
  feelsLike: 30,
  humidity: 70,
  windSpeed: 12,
  rainfall: 5,
  condition: 'Partly Cloudy',
  uv: 7,
  visibility: 8,
};

export default function WeatherWithCharts() {
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [viewMode, setViewMode] = useState<'combined' | 'separate'>('combined');

  // Load districts
  useEffect(() => {
    const loadData = async () => {
      const data = await loadDistrictsFromCSV('/districts.csv');
      setDistricts(data);
    };
    loadData();
  }, []);

  // District search
  const {
    searchQuery,
    selectedDistrict,
    selectedDistrictData,
    searchResults,
    setSearchQuery,
    setSelectedDistrict,
  } = useDistrictSearch(districts, {
    initialDistrict: 'Bengaluru Urban',
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Weather Forecast
            </h1>
            <p className="text-gray-600 mt-2">
              7-day weather forecast and farming insights
            </p>
          </div>

          {/* District Search */}
          <div className="w-full lg:w-96">
            <DistrictSearch
              districts={districts}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrict}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchResults={searchResults}
              placeholder="Search district..."
            />
          </div>
        </div>

        {/* Current Weather Card */}
        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-none">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5" />
                  <h2 className="text-2xl font-bold">{selectedDistrict || 'Bengaluru Urban'}</h2>
                </div>
                <p className="text-white/80 mb-4">
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>

                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-6xl font-bold">{currentWeather.temp}°</p>
                    <p className="text-white/80">Feels like {currentWeather.feelsLike}°C</p>
                  </div>
                  <Cloud className="h-20 w-20 opacity-80" />
                </div>

                <p className="text-xl mt-4">{currentWeather.condition}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="h-5 w-5" />
                    <span className="text-sm text-white/80">Humidity</span>
                  </div>
                  <p className="text-2xl font-bold">{currentWeather.humidity}%</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="h-5 w-5" />
                    <span className="text-sm text-white/80">Wind Speed</span>
                  </div>
                  <p className="text-2xl font-bold">{currentWeather.windSpeed} km/h</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CloudRain className="h-5 w-5" />
                    <span className="text-sm text-white/80">Rainfall</span>
                  </div>
                  <p className="text-2xl font-bold">{currentWeather.rainfall} mm</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="h-5 w-5" />
                    <span className="text-sm text-white/80">UV Index</span>
                  </div>
                  <p className="text-2xl font-bold">{currentWeather.uv}</p>
                </div>
              </div>
            </div>

            {/* Hourly Temperature Mini Chart */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-sm font-semibold mb-2 text-white/80">Today's Temperature</h3>
              <MiniSparkline data={hourlyTemp} color="#ffffff" height={50} />
            </div>
          </CardContent>
        </Card>

        {/* Chart View Toggle */}
        <div className="flex justify-end gap-2">
          <Button
            variant={viewMode === 'combined' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('combined')}
            className={viewMode === 'combined' ? 'bg-blue-600' : ''}
          >
            Combined View
          </Button>
          <Button
            variant={viewMode === 'separate' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('separate')}
            className={viewMode === 'separate' ? 'bg-blue-600' : ''}
          >
            Separate View
          </Button>
        </div>

        {/* Weather Charts */}
        {viewMode === 'combined' ? (
          <Card>
            <CardHeader>
              <CardTitle>7-Day Weather Forecast</CardTitle>
              <CardDescription>Temperature and rainfall trends</CardDescription>
            </CardHeader>
            <CardContent>
              <CombinedWeatherChart data={weatherForecast} height={350} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-red-500" />
                  Temperature Forecast
                </CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <TemperatureTrend data={weatherForecast} height={250} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5 text-blue-500" />
                  Rainfall Forecast
                </CardTitle>
                <CardDescription>Expected precipitation</CardDescription>
              </CardHeader>
              <CardContent>
                <RainfallChart data={weatherForecast} height={250} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Daily Forecast Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {weatherForecast.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="text-center card-hover">
                <CardContent className="p-4">
                  <p className="font-semibold text-slate-900 mb-2">{day.day}</p>
                  
                  {day.rainfall > 0 ? (
                    <CloudRain className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  ) : (
                    <Sun className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  )}

                  <p className="text-2xl font-bold text-slate-900 mb-2">{day.temp}°</p>

                  <div className="space-y-1 text-xs text-slate-600">
                    {day.rainfall > 0 && (
                      <div className="flex items-center justify-center gap-1">
                        <Droplets className="h-3 w-3 text-blue-500" />
                        <span>{day.rainfall}mm</span>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-1">
                      <Droplets className="h-3 w-3 text-slate-400" />
                      <span>{day.humidity}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Farming Advisory */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Farming Advisory</CardTitle>
            <CardDescription className="text-green-700">
              Based on upcoming weather conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-green-900">Irrigation Alert</p>
                  <p className="text-sm text-green-700">
                    Light rainfall expected Wed-Thu. Adjust irrigation schedule accordingly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-green-900">Temperature Rise</p>
                  <p className="text-sm text-green-700">
                    Temperature increasing over weekend. Monitor crops for heat stress.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-green-900">Best Days for Field Work</p>
                  <p className="text-sm text-green-700">
                    Monday, Tuesday, and weekend are ideal for harvesting and field activities.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* District Weather Info */}
        {selectedDistrictData && (
          <Card>
            <CardHeader>
              <CardTitle>Climate Information - {selectedDistrictData.district}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Weather Pattern</p>
                  <Badge variant="secondary" className="text-sm">
                    {selectedDistrictData.weather_pattern}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Average Rainfall</p>
                  <p className="text-lg font-bold text-blue-600">
                    {selectedDistrictData.avg_rainfall}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Recommended Crops</p>
                  <p className="text-sm text-slate-700">
                    {selectedDistrictData.recommended_crops.split(',').slice(0, 2).join(', ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
