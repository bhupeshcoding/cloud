import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Image, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnalysisResult } from "@/types/analysis";

interface ImageUploadProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
  isLoading?: boolean;
}

const ImageUpload = ({ onAnalysisComplete }: ImageUploadProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (!imageFile) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a valid image file (JPEG, PNG, WebP)",
        variant: "destructive",
      });
      return;
    }

    if (imageFile.size > 20 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be smaller than 20MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      simulateAnalysis();
    };
    reader.readAsDataURL(imageFile);
  };

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate AI analysis progress
    const intervals = [10, 25, 45, 65, 80, 95, 100];
    
    for (let i = 0; i < intervals.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnalysisProgress(intervals[i]);
    }

    // Simulate comprehensive analysis result
    const cloudTypes = ['cumulus', 'cumulonimbus', 'stratus', 'cirrus'] as const;
    const locations = [
      { name: 'Dharali, Uttarakhand', lat: 31.0169, lon: 78.3831 },
      { name: 'Gangotri, Uttarakhand', lat: 30.9944, lon: 78.4419 },
      { name: 'Harsil, Uttarakhand', lat: 31.0393, lon: 78.6068 },
      { name: 'Dehradun, Uttarakhand', lat: 30.3165, lon: 78.0322 },
      { name: 'Rishikesh, Uttarakhand', lat: 30.0869, lon: 78.2676 },
      { name: 'Nainital, Uttarakhand', lat: 30.2661, lon: 78.3472 },
    ] as const;
    
    const selectedLocation = locations[Math.floor(Math.random() * locations.length)];
    const isDharali = selectedLocation.name.includes('Dharali');
    
    // Higher chance of cloudburst risk in Dharali
    const cloudburstRisk = (isDharali 
      ? Math.random() > 0.3 ? 'extreme' : 'high'
      : Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low') as 'low' | 'medium' | 'high' | 'extreme';
    
    const riskLevel = isDharali 
      ? (Math.random() > 0.3 ? 'high' : 'extreme') as 'high' | 'extreme'
      : (Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low') as 'low' | 'medium' | 'high' | 'extreme';
    
    // Function to analyze image filename for flood indicators
    const analyzeImageForFlood = (filename: string): number => {
      if (!filename) return 0;
      
      const floodIndicators = [
        { term: 'flood', weight: 0.8 },
        { term: 'water', weight: 0.6 },
        { term: 'river', weight: 0.7 },
        { term: 'lake', weight: 0.5 },
        { term: 'overflow', weight: 0.9 },
        { term: 'damage', weight: 0.7 },
        { term: 'disaster', weight: 0.8 },
        { term: 'rain', weight: 0.5 },
        { term: 'storm', weight: 0.6 },
        { term: 'wet', weight: 0.4 }
      ];
      
      const lowerFilename = filename.toLowerCase();
      let floodScore = 0;
      
      // Check for flood indicators in filename
      for (const { term, weight } of floodIndicators) {
        if (lowerFilename.includes(term)) {
          floodScore = Math.max(floodScore, weight);
          // If we find a strong indicator, we can stop checking
          if (weight > 0.7) break;
        }
      }
      
      return floodScore;
    };
    
    // Enhanced flood detection logic with image analysis simulation
    const isFloodLikely = (cloudType: string, coverage: number, windShear: number) => {
      // Get image analysis score
      const imageScore = file ? analyzeImageForFlood(file.name) : 0;
      // Base factors
      const cloudFactor = cloudType === 'cumulonimbus' ? 0.8 : 
                         cloudType === 'nimbostratus' ? 0.7 : 0.3;
      
      // Higher chance if cloud coverage is very high
      const coverageFactor = Math.pow(coverage / 100, 1.5); // Non-linear scaling
      
      // Higher chance with higher wind shear
      const windFactor = Math.min(Math.pow(windShear / 8, 1.5), 1.2);
      
      // Terrain and water body detection simulation
      const hasWaterBodies = Math.random() > 0.7; // 30% chance of water bodies in frame
      const terrainType = Math.random(); // Simulate terrain analysis
      
      // Combine factors with weights
      const floodProbability = 
        (cloudFactor * 0.4) + 
        (coverageFactor * 0.3) + 
        (windFactor * 0.2) +
        (hasWaterBodies ? 0.2 : 0) +
        (terrainType > 0.7 ? 0.3 : 0);
      
      // Location-based risk (Dharali is high risk)
      const locationFactor = isDharali ? 0.5 : 0.15;
      
      // Add image analysis score to probability
      const finalProbability = Math.min(floodProbability + locationFactor + (imageScore * 0.5), 0.95);
      
      // If image strongly indicates flood, increase probability
      if (imageScore > 0.7) {
        return true;
      }
      
      return Math.random() < finalProbability;
    };
    
    const cloudType = isDharali ? 'cumulonimbus' : cloudTypes[Math.floor(Math.random() * cloudTypes.length)];
    const cloudCoverage = isDharali ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 60) + 20;
    const windShear = isDharali ? Math.floor(Math.random() * 10) + 10 : Math.floor(Math.random() * 8) + 2;
    
    const floodDetected = isFloodLikely(cloudType, cloudCoverage, windShear);
    
    const mockResult: AnalysisResult = {
      floodDetected,
      confidence: floodDetected 
        ? Math.floor(Math.random() * 15) + 85 // Higher confidence when flood is detected
        : Math.floor(Math.random() * 25) + 65, // Lower confidence when no flood
      riskLevel,
      affectedArea: floodDetected 
        ? (isDharali ? Math.floor(Math.random() * 800) + 200 : Math.floor(Math.random() * 500) + 100)
        : Math.floor(Math.random() * 100), // Smaller area if no flood detected
      timestamp: new Date().toISOString(),
      location: selectedLocation,
      cloudPattern: {
        detected: true,
        type: isDharali ? 'cumulonimbus' : cloudTypes[Math.floor(Math.random() * cloudTypes.length)],
        cloudBurstRisk: cloudburstRisk,
        coverage: isDharali ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 60) + 20,
        windShear: isDharali ? Math.floor(Math.random() * 10) + 10 : Math.floor(Math.random() * 8) + 2,
        moistureContent: isDharali ? Math.floor(Math.random() * 5) + 10 : Math.floor(Math.random() * 8) + 3,
        confidence: isDharali ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 30) + 70,
      },
      weather: {
        temperature: isDharali ? Math.floor(Math.random() * 10) + 15 : Math.floor(Math.random() * 25) + 15,
        humidity: isDharali ? Math.floor(Math.random() * 20) + 70 : Math.floor(Math.random() * 40) + 40,
        windSpeed: isDharali ? Math.floor(Math.random() * 15) + 15 : Math.floor(Math.random() * 30) + 5,
        pressure: isDharali ? Math.floor(Math.random() * 20) + 980 : Math.floor(Math.random() * 50) + 990,
        location: selectedLocation.name,
      },
    };

    setIsAnalyzing(false);
    onAnalysisComplete?.(mockResult);

    toast({
      title: "Analysis Complete",
      description: `Flood ${mockResult.floodDetected ? 'detected' : 'not detected'}, Cloud pattern: ${mockResult.cloudPattern?.type || 'none'}`,
      variant: mockResult.floodDetected ? "destructive" : "default",
    });
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Upload Satellite Imagery
          </h2>
          <p className="text-xl text-muted-foreground">
            Drop your satellite or aerial images for flood detection, cloud pattern analysis, and weather monitoring
          </p>
        </div>

        <Card className="shadow-elevated border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-6 h-6 text-primary" />
              Image Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!uploadedImage ? (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 cursor-pointer ${
                  dragOver
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className={`w-16 h-16 mx-auto mb-4 ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="text-xl font-semibold mb-2">
                  {dragOver ? 'Drop your image here' : 'Upload Satellite Image'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your image or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports JPEG, PNG, WebP • Max 20MB
                </p>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-lg overflow-hidden shadow-card">
                  <img
                    src={uploadedImage}
                    alt="Uploaded satellite imagery"
                    className="w-full h-64 object-cover"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="bg-card/95 p-4 rounded-lg shadow-elevated">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">Analyzing imagery...</p>
                      </div>
                    </div>
                  )}
                </div>

                {isAnalyzing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analysis Progress</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    onClick={resetUpload}
                    variant="outline"
                    className="flex-1"
                  >
                    Upload New Image
                  </Button>
                  {!isAnalyzing && (
                    <Button 
                      onClick={simulateAnalysis}
                      className="flex-1 bg-gradient-primary"
                    >
                      Reanalyze
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ImageUpload;