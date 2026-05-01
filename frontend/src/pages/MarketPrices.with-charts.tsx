/**
 * Market Prices Page with Charts
 * Example integration of chart components in responsive cards
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CropPriceTrend, 
  PriceComparisonChart,
  MarketShareChart,
  MiniSparkline 
} from '@/components/ui/charts';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

// Sample data (replace with actual API calls)
const generatePriceData = (basePrice: number, days: number = 7) => {
  const data = [];
  for (let i = 0; i < days; i++) {
    const variance = (Math.random() - 0.5) * basePrice * 0.1;
    data.push({
      date: new Date(Date.now() - (days - i - 1) * 86400000)
        .toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      price: Math.round(basePrice + variance),
    });
  }
  return data;
};

const cropPricesData = [
  { 
    id: 1, 
    name: 'Rice', 
    currentPrice: 2800, 
    change: 5.2, 
    unit: 'quintal',
    market: 'Bengaluru',
    trend: generatePriceData(2800, 7),
    miniTrend: [2650, 2700, 2750, 2720, 2780, 2800, 2850]
  },
  { 
    id: 2, 
    name: 'Wheat', 
    currentPrice: 2200, 
    change: -2.3, 
    unit: 'quintal',
    market: 'Mysuru',
    trend: generatePriceData(2200, 7),
    miniTrend: [2300, 2280, 2250, 2240, 2220, 2210, 2200]
  },
  { 
    id: 3, 
    name: 'Maize', 
    currentPrice: 1850, 
    change: 0.8, 
    unit: 'quintal',
    market: 'Dharwad',
    trend: generatePriceData(1850, 7),
    miniTrend: [1830, 1840, 1835, 1850, 1845, 1850, 1855]
  },
  { 
    id: 4, 
    name: 'Cotton', 
    currentPrice: 6500, 
    change: 8.5, 
    unit: 'quintal',
    market: 'Bagalkot',
    trend: generatePriceData(6500, 7),
    miniTrend: [6000, 6150, 6300, 6350, 6450, 6500, 6550]
  },
  { 
    id: 5, 
    name: 'Groundnut', 
    currentPrice: 5200, 
    change: 3.1, 
    unit: 'quintal',
    market: 'Kolar',
    trend: generatePriceData(5200, 7),
    miniTrend: [5000, 5050, 5100, 5150, 5180, 5200, 5220]
  },
  { 
    id: 6, 
    name: 'Sugarcane', 
    currentPrice: 3200, 
    change: -1.5, 
    unit: 'ton',
    market: 'Mandya',
    trend: generatePriceData(3200, 7),
    miniTrend: [3250, 3240, 3230, 3220, 3210, 3200, 3195]
  },
];

const priceComparisonData = cropPricesData.slice(0, 5).map(crop => ({
  crop: crop.name,
  price: crop.currentPrice,
  change: crop.change
}));

const marketShareData = [
  { name: 'Rice', value: 30 },
  { name: 'Cotton', value: 25 },
  { name: 'Groundnut', value: 20 },
  { name: 'Maize', value: 15 },
  { name: 'Others', value: 10 },
];

export default function MarketPricesWithCharts() {
  const [selectedCrop, setSelectedCrop] = useState(cropPricesData[0]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Market Prices
          </h1>
          <p className="text-gray-600 mt-2">
            Live crop prices and market trends from Karnataka's main markets
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cropPricesData.slice(0, 4).map((crop, index) => {
            const isPositive = crop.change > 0;
            const isNegative = crop.change < 0;

            return (
              <motion.div
                key={crop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="card-hover cursor-pointer" onClick={() => setSelectedCrop(crop)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">{crop.name}</CardTitle>
                      {isPositive ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : isNegative ? (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      ) : (
                        <Minus className="h-4 w-4 text-slate-600" />
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3" />
                      {crop.market}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-slate-900">
                        ₹{crop.currentPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-600">per {crop.unit}</p>
                    </div>

                    {/* Mini sparkline */}
                    <div className="mb-2">
                      <MiniSparkline 
                        data={crop.miniTrend} 
                        color={isPositive ? '#16a34a' : isNegative ? '#ef4444' : '#64748b'}
                        height={40}
                      />
                    </div>

                    <Badge 
                      variant={isPositive ? 'default' : isNegative ? 'destructive' : 'secondary'}
                      className={isPositive ? 'bg-green-600' : ''}
                    >
                      {isPositive ? '+' : ''}{crop.change}% this week
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selected Crop Detail */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedCrop.name} - Price Trend</CardTitle>
                  <CardDescription>{selectedCrop.market} Market</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={timeRange === '7d' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange('7d')}
                    className={timeRange === '7d' ? 'bg-leaf-600' : ''}
                  >
                    7D
                  </Button>
                  <Button
                    variant={timeRange === '30d' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange('30d')}
                    className={timeRange === '30d' ? 'bg-leaf-600' : ''}
                  >
                    30D
                  </Button>
                  <Button
                    variant={timeRange === '90d' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange('90d')}
                    className={timeRange === '90d' ? 'bg-leaf-600' : ''}
                  >
                    90D
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CropPriceTrend 
                data={selectedCrop.trend}
                title=""
                height={300}
                showTrend={true}
                currency="₹"
              />

              {/* Price Info */}
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Current Price</p>
                  <p className="text-lg font-bold text-slate-900">
                    ₹{selectedCrop.currentPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">7-Day High</p>
                  <p className="text-lg font-bold text-green-600">
                    ₹{Math.max(...selectedCrop.trend.map(d => d.price)).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">7-Day Low</p>
                  <p className="text-lg font-bold text-red-600">
                    ₹{Math.min(...selectedCrop.trend.map(d => d.price)).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Share */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Market Distribution</CardTitle>
              <CardDescription>Trading volume by crop</CardDescription>
            </CardHeader>
            <CardContent>
              <MarketShareChart data={marketShareData} height={250} />
            </CardContent>
          </Card>
        </div>

        {/* Price Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Price Comparison Across Crops</CardTitle>
            <CardDescription>Current prices per quintal/ton</CardDescription>
          </CardHeader>
          <CardContent>
            <PriceComparisonChart 
              data={priceComparisonData}
              height={300}
              currency="₹"
            />
          </CardContent>
        </Card>

        {/* All Crops Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Crop Prices</CardTitle>
            <CardDescription>Updated today at 10:00 AM IST</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Crop</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Market</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Price</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Change</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {cropPricesData.map((crop, index) => {
                    const isPositive = crop.change > 0;
                    const isNegative = crop.change < 0;

                    return (
                      <motion.tr
                        key={crop.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b hover:bg-slate-50 cursor-pointer"
                        onClick={() => setSelectedCrop(crop)}
                      >
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900">{crop.name}</p>
                          <p className="text-xs text-slate-600">per {crop.unit}</p>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {crop.market}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-900">
                          ₹{crop.currentPrice.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`text-sm font-medium ${
                            isPositive ? 'text-green-600' : 
                            isNegative ? 'text-red-600' : 
                            'text-slate-600'
                          }`}>
                            {isPositive ? '+' : ''}{crop.change}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-24 mx-auto">
                            <MiniSparkline 
                              data={crop.miniTrend}
                              color={isPositive ? '#16a34a' : isNegative ? '#ef4444' : '#64748b'}
                              height={30}
                            />
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Update Notice */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4" />
          <span>Prices updated every hour • Last update: {new Date().toLocaleTimeString('en-IN')}</span>
        </div>
      </div>
    </Layout>
  );
}
