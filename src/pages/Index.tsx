import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import ImageUpload from "@/components/ImageUpload";
import AnalysisResults from "@/components/AnalysisResults";
import Dashboard from "@/components/Dashboard";

interface AnalysisResult {
  floodDetected: boolean;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  affectedArea: number;
  timestamp: string;
}

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
  };

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ImageUpload onAnalysisComplete={handleAnalysisComplete} />
      {analysisResult && <AnalysisResults result={analysisResult} />}
      <Dashboard />
    </main>
  );
};

export default Index;