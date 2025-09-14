import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import ImageUpload from "@/components/ImageUpload";
import AnalysisResults from "@/components/AnalysisResults";
import { getCloudburstRisk } from "@/lib/api/floodService";
import { AnalysisResult, CloudburstRiskData } from "@/types/analysis";

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [cloudburstRisk, setCloudburstRisk] = useState<CloudburstRiskData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysisComplete = async (result: AnalysisResult) => {
    setAnalysisResult(result);
    
    // If we have location data, check for cloudburst risk
    if (result.location?.lat && result.location?.lon) {
      setIsLoading(true);
      try {
        const riskData = await getCloudburstRisk(result.location.lat, result.location.lon);
        setCloudburstRisk(riskData);
      } catch (error) {
        console.error('Error checking cloudburst risk:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Clear cloudburst risk when analysis is cleared
  useEffect(() => {
    if (!analysisResult) {
      setCloudburstRisk(null);
    }
  }, [analysisResult]);

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ImageUpload 
        onAnalysisComplete={handleAnalysisComplete} 
        isLoading={isLoading}
      />
      {analysisResult && (
        <AnalysisResults 
          result={analysisResult} 
          cloudburstRisk={cloudburstRisk}
          isLoading={isLoading}
        />
      )}
      {/* <Dashboard /> */}
    </main>
  );
};

export default Index;