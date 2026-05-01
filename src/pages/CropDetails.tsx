import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Droplets, MapPin, ListChecks, Sprout, AlertTriangle, Beaker, Zap, Calendar, Wind } from 'lucide-react';
import { apiGet } from '@/lib/httpClient';
import FertilizerModule from '@/components/features/FertilizerModule';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/ui/animations';

export default function CropDetails() {
  const { cropName } = useParams<{ cropName: string }>();
  const navigate = useNavigate();
  const [crop, setCrop] = useState<any>(null);
  const [cropInfo, setCropInfo] = useState<any>(null);
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

  // Fetch detailed crop info from fertilizer dataset
  useEffect(() => {
    if (!cropName) return;
    const fetchCropInfo = async () => {
      try {
        const data = await apiGet(`/api/fertilizer/crop-info?crop=${encodeURIComponent(cropName)}`);
        if (data && !data.error) {
          setCropInfo(data);
        }
      } catch (error) {
        console.error('Failed to fetch crop info:', error);
      }
    };
    fetchCropInfo();
  }, [cropName]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
          <p className="text-gold-100/50 text-sm font-medium animate-pulse">Loading agricultural data...</p>
        </div>
      </Layout>
    );
  }

  if (!crop) {
    return (
      <Layout>
        <div className="text-center py-24 bg-earth-card rounded-2xl border border-earth-border">
          <AlertTriangle className="h-16 w-16 text-gold-400 mx-auto mb-4 opacity-20" />
          <h2 className="text-2xl font-bold text-gold-100 mb-4">Crop Analytics Unavailable</h2>
          <p className="text-gold-100/60 mb-8 max-w-md mx-auto">We couldn't find the specific data for {cropName}. Please try searching for another crop.</p>
          <Button onClick={() => navigate('/dashboard')} className="btn-gold px-8">Back to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 pb-12">
        <ScrollReveal direction="left" delay={0.1}>
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="group text-gold-100/60 hover:text-gold-400 hover:bg-gold-400/5 transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Insights
          </Button>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ScrollReveal direction="up" delay={0.2}>
              <Card className="card-premium overflow-hidden border-none shadow-premium h-full">
                {crop.imageUrl && (
                  <div className="relative h-72 w-full overflow-hidden">
                    <img src={crop.imageUrl} alt={crop.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-earth-card via-earth-card/20 to-transparent" />
                    <div className="absolute bottom-6 left-8">
                      <Badge className="bg-gold-400 text-earth-main font-bold px-3 py-1 mb-3">
                        {crop.season} Season
                      </Badge>
                      <h1 className="text-4xl font-black text-gold-100 tracking-tight">{crop.name}</h1>
                    </div>
                  </div>
                )}
                {!crop.imageUrl && (
                   <CardHeader className="pt-8 pb-4">
                     <h1 className="text-4xl font-black text-gold-100 tracking-tight">{crop.name}</h1>
                     <CardDescription className="text-gold-400 font-bold uppercase tracking-widest text-xs">
                        Ideal for {crop.district || 'multiple districts'}
                     </CardDescription>
                   </CardHeader>
                )}
                <CardContent className={crop.imageUrl ? "pt-6 pb-8 px-8" : "pb-8 px-8"}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-earth-elevated rounded-2xl border border-earth-border">
                      <div className="flex items-center gap-2 text-gold-100/40 text-[10px] uppercase tracking-widest font-black mb-2">
                        <Calendar className="h-3 w-3" />
                        Cultivation Duration
                      </div>
                      <div className="text-2xl font-bold text-gold-100">{crop.durationDays} <span className="text-sm font-normal text-gold-100/60">Days</span></div>
                    </div>
                    <div className="p-4 bg-earth-elevated rounded-2xl border border-earth-border">
                      <div className="flex items-center gap-2 text-gold-100/40 text-[10px] uppercase tracking-widest font-black mb-2">
                        <Wind className="h-3 w-3" />
                        Optimal Pattern
                      </div>
                      <div className="text-2xl font-bold text-gold-100 truncate">{crop.weatherPattern || 'Standard'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="right" delay={0.3}>
            <Card className="bg-gradient-to-br from-gold-400 to-gold-600 text-earth-main border-none shadow-gold-glow h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-earth-main font-black flex items-center uppercase tracking-tighter text-xl">
                  <DollarSign className="mr-2 h-6 w-6" /> Financial Returns
                </CardTitle>
                <CardDescription className="text-earth-main/60 font-bold">Estimated economic analysis per acre</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 flex flex-col justify-center">
                <div className="bg-earth-main/10 p-5 rounded-2xl border border-earth-main/5">
                  <div className="text-[10px] text-earth-main/60 uppercase tracking-widest font-black mb-1">Capital Investment</div>
                  <div className="text-4xl font-black tracking-tighter">₹{crop.investmentPerAcre?.toLocaleString() || 'N/A'}</div>
                </div>
                
                <div className="bg-earth-main/10 p-5 rounded-2xl border border-earth-main/5">
                  <div className="text-[10px] text-earth-main/60 uppercase tracking-widest font-black mb-1">Projected Returns</div>
                  <div className="text-4xl font-black tracking-tighter">₹{crop.expectedReturns?.toLocaleString() || 'N/A'}</div>
                </div>
                
                <div className="flex items-center justify-between px-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-bold uppercase tracking-tight">Break-even</span>
                  </div>
                  <span className="text-xl font-black">{crop.breakevenMonths ? `${crop.breakevenMonths} Mo` : 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* Soil & Water */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal direction="up" delay={0.4}>
            <Card className="card-premium h-full">
              <CardHeader className="border-b border-earth-border/50">
                <CardTitle className="flex items-center text-lg text-gold-100 font-bold">
                  <MapPin className="mr-2 h-5 w-5 text-gold-400" /> Soil Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <span className="text-[10px] font-black text-gold-100/40 uppercase tracking-widest block mb-2">Ideal Soil Composition</span>
                  <p className="text-gold-100 text-lg font-medium leading-relaxed">
                    {crop.soilType || 'Requires well-drained fertile soil for optimal root penetration.'}
                  </p>
                </div>
                {cropInfo?.soil_requirements && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-earth-elevated rounded-xl border border-earth-border">
                      <span className="text-[10px] font-black text-gold-100/40 uppercase tracking-widest block mb-1">pH Level</span>
                      <span className="text-sm font-bold text-gold-400">{cropInfo.soil_requirements.ph_range}</span>
                    </div>
                    <div className="p-3 bg-earth-elevated rounded-xl border border-earth-border">
                      <span className="text-[10px] font-black text-gold-100/40 uppercase tracking-widest block mb-1">Organic Carbon</span>
                      <span className="text-sm font-bold text-gold-400">{cropInfo.soil_requirements.organic_carbon}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.5}>
            <Card className="card-premium h-full">
              <CardHeader className="border-b border-earth-border/50">
                <CardTitle className="flex items-center text-lg text-gold-100 font-bold">
                  <Droplets className="mr-2 h-5 w-5 text-gold-400" /> Hydration Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                 <div className="mb-6">
                  <span className="text-[10px] font-black text-gold-100/40 uppercase tracking-widest block mb-2">Rainfall Dynamics</span>
                  <p className="text-gold-100 text-lg font-medium leading-relaxed">
                    {crop.rainfallMm ? `${crop.rainfallMm} mm annual precipitation recommended.` : 'Requires precision irrigation schedule for maximum yield.'}
                  </p>
                </div>
                <div className="p-4 bg-earth-elevated rounded-xl border border-earth-border flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-gold-400/10 rounded-lg"><Zap className="h-4 w-4 text-gold-400" /></div>
                      <span className="text-xs font-bold text-gold-100/70">Efficiency Index</span>
                   </div>
                   <span className="text-sm font-bold text-gold-400">High Performance</span>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* Nutrient Requirements */}
        {cropInfo?.nutrient_requirement_per_acre && (
          <ScrollReveal direction="up" delay={0.6}>
            <Card className="card-premium overflow-hidden">
              <CardHeader className="border-b border-earth-border/50">
                <CardTitle className="flex items-center text-lg text-gold-100 font-bold">
                  <Beaker className="mr-2 h-5 w-5 text-gold-400" /> Nutrient Profiles (Per Acre)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="relative group p-6 bg-earth-elevated rounded-2xl border border-earth-border transition-all hover:border-gold-400/30">
                    <div className="absolute top-2 right-4 text-4xl font-black text-gold-100/5 select-none group-hover:text-gold-400/10 transition-colors">N</div>
                    <div className="text-4xl font-black text-gold-400 mb-1">{cropInfo.nutrient_requirement_per_acre.nitrogen_kg} <span className="text-sm font-normal text-gold-100/40">kg</span></div>
                    <div className="text-xs font-bold text-gold-100/60 uppercase tracking-widest">Nitrogen Intake</div>
                  </div>
                  <div className="relative group p-6 bg-earth-elevated rounded-2xl border border-earth-border transition-all hover:border-gold-400/30">
                    <div className="absolute top-2 right-4 text-4xl font-black text-gold-100/5 select-none group-hover:text-gold-400/10 transition-colors">P</div>
                    <div className="text-4xl font-black text-gold-400 mb-1">{cropInfo.nutrient_requirement_per_acre.phosphorus_kg} <span className="text-sm font-normal text-gold-100/40">kg</span></div>
                    <div className="text-xs font-bold text-gold-100/60 uppercase tracking-widest">Phosphorus Intake</div>
                  </div>
                  <div className="relative group p-6 bg-earth-elevated rounded-2xl border border-earth-border transition-all hover:border-gold-400/30">
                    <div className="absolute top-2 right-4 text-4xl font-black text-gold-100/5 select-none group-hover:text-gold-400/10 transition-colors">K</div>
                    <div className="text-4xl font-black text-gold-400 mb-1">{cropInfo.nutrient_requirement_per_acre.potassium_kg} <span className="text-sm font-normal text-gold-100/40">kg</span></div>
                    <div className="text-xs font-bold text-gold-100/60 uppercase tracking-widest">Potassium Intake</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {/* Deficiency Symptoms */}
        {cropInfo?.deficiency_symptoms && (
          <ScrollReveal direction="up" delay={0.7}>
            <Card className="border border-gold-400/20 bg-gold-400/5">
              <CardHeader>
                <CardTitle className="flex items-center text-lg text-gold-400 font-bold">
                  <AlertTriangle className="mr-2 h-5 w-5" /> Biological Indicators (Deficiency)
                </CardTitle>
                <CardDescription className="text-gold-100/40">Early warning systems for physiological stress.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(cropInfo.deficiency_symptoms).map(([nutrient, symptom]: [string, any]) => (
                    <div key={nutrient} className="p-4 bg-earth-main/50 rounded-xl border border-earth-border transition-all hover:border-gold-400/30 group">
                      <div className="font-black text-gold-400 uppercase tracking-widest text-[10px] mb-2 group-hover:text-gold-300 transition-colors">{nutrient} Loss</div>
                      <div className="text-sm text-gold-100/70 leading-relaxed italic">"{symptom}"</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {/* Detailed Growing Steps */}
        {(cropInfo?.growing_steps?.length > 0 || crop.guidelines) && (
          <ScrollReveal direction="up" delay={0.8}>
            <Card className="card-premium">
              <CardHeader className="border-b border-earth-border/50 px-8 py-6">
                <CardTitle className="flex items-center text-2xl text-gold-100 font-black tracking-tight">
                  <Sprout className="mr-3 h-7 w-7 text-gold-400" /> Cultivation Architecture
                </CardTitle>
                <CardDescription className="text-gold-100/40 font-medium">
                  Precision roadmap for maximum yield optimization.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {cropInfo?.growing_steps?.length > 0 ? (
                  <div className="divide-y divide-earth-border">
                    {cropInfo.growing_steps.map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-6 p-8 hover:bg-earth-elevated/30 transition-colors group">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-earth-elevated text-gold-400 border border-earth-border flex items-center justify-center font-black text-xl shadow-lg group-hover:bg-gold-400 group-hover:text-earth-main group-hover:border-gold-400 transition-all duration-300">
                          {step.step_number}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-gold-100 text-lg group-hover:text-gold-400 transition-colors uppercase tracking-tight">{step.title}</h4>
                          <p className="text-gold-100/60 mt-2 leading-relaxed text-sm">{step.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 prose prose-invert max-w-none text-gold-100/70 leading-relaxed text-sm">
                    {crop.guidelines.split('\n').map((para: string, idx: number) => (
                      <p key={idx} className="mb-4">{para}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        <ScrollReveal direction="up" delay={0.9}>
           <FertilizerModule cropName={crop.name} />
        </ScrollReveal>
      </div>
    </Layout>
  );
}
