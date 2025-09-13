import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Download,
  Share2 
} from "lucide-react";

interface AnalysisResult {
  floodDetected: boolean;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  affectedArea: number;
  timestamp: string;
}

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'critical';
      default: return 'secondary';
    }
  };

  const getRiskGradient = (level: string) => {
    switch (level) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      case 'high': return 'risk-high';
      default: return '';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <section className="py-20 bg-background">
      <div className="container px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Analysis Results
          </h2>
          <p className="text-xl text-muted-foreground">
            AI-powered flood detection analysis for Uttarakhand region
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Result Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className={`shadow-elevated border-0 ${getRiskGradient(result.riskLevel)}`}>
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  {result.floodDetected ? (
                    <AlertTriangle className="w-12 h-12 text-destructive-foreground animate-pulse-alert" />
                  ) : (
                    <CheckCircle className="w-12 h-12 text-success-foreground" />
                  )}
                </div>
                <CardTitle className="text-3xl font-bold text-white">
                  {result.floodDetected ? 'Flood Detected' : 'No Flood Detected'}
                </CardTitle>
                <p className="text-xl text-white/80">
                  Confidence Level: {result.confidence}%
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-white" />
                      <span className="text-white/80 text-sm font-medium">Risk Level</span>
                    </div>
                    <Badge variant="outline" className="text-white border-white/30 bg-white/20">
                      {result.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-white" />
                      <span className="text-white/80 text-sm font-medium">Affected Area</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{result.affectedArea} km²</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="text-white/80 text-sm font-medium">Analysis Timestamp</span>
                  </div>
                  <span className="text-lg text-white">{formatTimestamp(result.timestamp)}</span>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.floodDetected ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-destructive">Immediate Action Required</h4>
                        <p className="text-sm text-muted-foreground">
                          Alert emergency services and evacuate affected areas immediately.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg">
                      <Clock className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-warning">Monitor Situation</h4>
                        <p className="text-sm text-muted-foreground">
                          Continue monitoring water levels and weather conditions.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-success">Area Safe</h4>
                      <p className="text-sm text-muted-foreground">
                        No immediate flood risk detected. Continue regular monitoring.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Analysis Time</span>
                  <span className="font-semibold">2.3s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Image Resolution</span>
                  <span className="font-semibold">1024x768</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">AI Model</span>
                  <span className="font-semibold">FloodNet v2.1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-semibold">Uttarakhand</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Satellite Feed</span>
                  <Badge variant="outline" className="text-success border-success">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Processing</span>
                  <Badge variant="outline" className="text-success border-success">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Alert System</span>
                  <Badge variant="outline" className="text-success border-success">Ready</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisResults;