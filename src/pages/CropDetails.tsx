import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Droplets, MapPin, ListChecks } from 'lucide-react';
import { apiGet } from '@/lib/httpClient';

export default function CropDetails() {
  const { cropName } = useParams<{ cropName: string }>();
  const navigate = useNavigate();
  const [crop, setCrop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCropDetails = async () => {
      try {
        const crops = await apiGet('/api/crops');
        const match = crops.find((c: any) => c.name.toLowerCase() === cropName?.toLowerCase());
        setCrop(match);
      } catch (error) {
        console.error('Failed to fetch crops:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCropDetails();
  }, [cropName]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  if (!crop) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Crop not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden h-full">
              {crop.imageUrl && (
                <img src={crop.imageUrl} alt={crop.name} className="w-full h-64 object-cover" />
              )}
              <CardHeader>
                <CardTitle className="text-3xl">{crop.name}</CardTitle>
                <CardDescription className="text-base">
                  Ideal for {crop.district || 'multiple districts'} | {crop.season} Season
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div>
                    <span className="font-semibold block text-gray-500">Duration:</span> 
                    <span className="text-lg">{crop.durationDays} days</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-gray-500">Weather Pattern:</span> 
                    <span className="text-lg">{crop.weatherPattern || 'Standard'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white flex flex-col justify-center">
            <CardHeader>
              <CardTitle className="text-white flex items-center"><DollarSign className="mr-2" /> Financial Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-sm opacity-90 uppercase tracking-wide">Investment/Acre</div>
                <div className="text-3xl font-bold">₹{crop.investmentPerAcre?.toLocaleString() || 'N/A'}</div>
              </div>
              <div className="h-px bg-white/20 w-full rounded"></div>
              <div>
                <div className="text-sm opacity-90 uppercase tracking-wide">Expected Returns</div>
                <div className="text-3xl font-bold">₹{crop.expectedReturns?.toLocaleString() || 'N/A'}</div>
              </div>
              <div className="h-px bg-white/20 w-full rounded"></div>
              <div>
                <div className="text-sm opacity-90 uppercase tracking-wide">Break-even Period</div>
                <div className="text-2xl font-semibold">{crop.breakevenMonths ? `${crop.breakevenMonths} months` : 'N/A'}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <MapPin className="mr-2 h-5 w-5 text-green-600" /> Land & Soil Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-lg">
                <span className="font-semibold block text-gray-900 mb-2">Soil Type</span>
                {crop.soilType || 'Well drained soil'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Droplets className="mr-2 h-5 w-5 text-blue-500" /> Water Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-lg">
                <span className="font-semibold block text-gray-900 mb-2">Rainfall</span>
                {crop.rainfallMm ? `${crop.rainfallMm} mm annually` : 'Optimal irrigation required'}
              </p>
            </CardContent>
          </Card>
        </div>

        {crop.guidelines && (
          <Card className="border-t-4 border-t-green-500">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <ListChecks className="mr-2 h-6 w-6 text-green-600" /> Cultivation Guidelines
              </CardTitle>
              <CardDescription>
                Step-by-step phases of cultivation including soil prep, sowing, irrigation, fertilization, pest control, and harvesting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-green max-w-none text-gray-700">
                {crop.guidelines.split('\n').map((para: string, idx: number) => (
                  <p key={idx} className="mb-4">{para}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
