import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Image, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onAnalysisComplete?: (result: any) => void;
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

    // Simulate analysis result
    const mockResult = {
      floodDetected: Math.random() > 0.5,
      confidence: Math.floor(Math.random() * 30) + 70,
      riskLevel: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
      affectedArea: Math.floor(Math.random() * 500) + 100,
      timestamp: new Date().toISOString(),
    };

    setIsAnalyzing(false);
    onAnalysisComplete?.(mockResult);

    toast({
      title: "Analysis Complete",
      description: `Flood ${mockResult.floodDetected ? 'detected' : 'not detected'} with ${mockResult.confidence}% confidence`,
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
            Drop your satellite or aerial images for instant flood analysis
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