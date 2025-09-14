import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Download,
  Share2,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  AlertCircle,
  Info,
  FileDown
} from "lucide-react";
import WeatherReport from "./WeatherReport";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadPdf } from "@/lib/utils/pdfGenerator";
import { AnalysisResult, CloudburstRiskData } from "@/types/analysis";

interface AnalysisResultsProps {
  result: AnalysisResult;
  cloudburstRisk: CloudburstRiskData | null;
  isLoading: boolean;
}

const AnalysisResults = ({ result, cloudburstRisk, isLoading }: AnalysisResultsProps) => {
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-500';
      case 'moderate':
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'extreme': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getRiskTextColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'moderate':
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'extreme': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRiskGradient = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'from-green-500/10 to-green-700/5';
      case 'moderate':
      case 'medium': return 'from-yellow-500/10 to-yellow-700/5';
      case 'high': return 'from-orange-500/10 to-orange-700/5';
      case 'extreme': return 'from-red-600/10 to-red-800/5';
      default: return 'from-gray-500/10 to-gray-700/5';
    }
  };

  const getCloudTypeName = (type?: string | null) => {
    if (!type) return 'Unknown';
    switch (type.toLowerCase()) {
      case 'cumulonimbus': return 'Cumulonimbus (Cb)';
      case 'cumulus': return 'Cumulus (Cu)';
      case 'stratus': return 'Stratus (St)';
      case 'cirrus': return 'Cirrus (Ci)';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getCloudburstRiskDescription = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'Minimal risk of cloudburst. Standard weather conditions expected.';
      case 'medium':
      case 'moderate':
        return 'Moderate risk of cloudburst. Monitor weather conditions closely and stay alert for updates.';
      case 'high':
        return 'High risk of cloudburst. Be prepared for heavy rainfall and potential flooding.';
      case 'extreme':
        return 'EXTREME RISK OF CLOUDBURST. Take immediate action to protect life and property as heavy rainfall is imminent.';
      default:
        return 'Cloudburst risk assessment not available.';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  // Render cloudburst risk section
  const renderCloudburstRisk = () => {
    if (isLoading) {
      return (
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      );
    }

    if (!cloudburstRisk) return null;

    const riskLevel = cloudburstRisk.risk === 'moderate' ? 'medium' : cloudburstRisk.risk;
    const riskColor = getRiskColor(riskLevel);
    const textColor = getRiskTextColor(riskLevel);

    return (
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CloudRain className={`w-5 h-5 ${textColor}`} />
            <CardTitle className="text-lg font-semibold">Cloudburst Risk Assessment</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${riskColor}`}></div>
                <span className={`font-medium ${textColor} capitalize`}>
                  {riskLevel}
                  {riskLevel === 'extreme' && ' (Cloudburst Likely)'}
                </span>
              </div>
            </div>
            <Badge variant="outline" className={`${textColor} border-current/30`}>
              {Math.round(cloudburstRisk.confidence * 100)}% Confidence
            </Badge>
          </div>

          {cloudburstRisk.cloudType && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-white/5 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Cloud Type</p>
                <p className="font-medium">{getCloudTypeName(cloudburstRisk.cloudType)}</p>
              </div>
              {cloudburstRisk.windShear && (
                <div className="bg-white/50 dark:bg-white/5 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Wind Shear</p>
                  <p className="font-medium">{cloudburstRisk.windShear} m/s</p>
                </div>
              )}
              {cloudburstRisk.moistureContent && (
                <div className="bg-white/50 dark:bg-white/5 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Moisture Content</p>
                  <p className="font-medium">{cloudburstRisk.moistureContent} g/m³</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-2">
            <p className="text-sm text-muted-foreground">Assessment</p>
            <p className="text-sm mt-1">
              {getCloudburstRiskDescription(riskLevel)}
              {riskLevel === 'extreme' && (
                <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  Immediate action recommended
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleDownloadPdf = () => {
    downloadPdf(result, cloudburstRisk, 'uttarakhand_flood_analysis');
  };

  return (
    <section className="py-12 bg-background">
      <div className="container px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
              Analysis Results
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              AI-powered flood detection, cloud pattern analysis, and weather monitoring
            </p>
          </div>
          <Button 
            onClick={handleDownloadPdf}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Download Report (PDF)
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Result Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className={`border-0 bg-white dark:bg-gray-900 shadow-lg`}>
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  {result.floodDetected ? (
                    <AlertTriangle className="w-12 h-12 text-red-500 dark:text-red-400 animate-pulse" />
                  ) : (
                    <CheckCircle className="w-12 h-12 text-green-500 dark:text-green-400" />
                  )}
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {result.floodDetected ? 'Flood Detected' : 'No Flood Detected'}
                </CardTitle>
                <div className="mt-2">
                  <Badge className={`text-sm font-semibold ${getRiskTextColor(result.riskLevel)} ${getRiskColor(result.riskLevel)}/20 border border-opacity-20`}>
                    {result.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  Confidence: {result.confidence}%
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Risk Level</span>
                    </div>
                    <Badge variant="outline" className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                      {result.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Affected Area</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{result.affectedArea} km²</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Analysis Timestamp</span>
                  </div>
                  <span className="text-lg text-gray-900 dark:text-white">{formatTimestamp(result.timestamp)}</span>
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
                    <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                      <MapPin className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-black">Location</p>
                        <p className="text-sm text-muted-foreground">
                          {result.location?.name || 'Uttarakhand Region'}
                          {result.location?.lat && result.location?.lon && (
                            <span className="text-xs block opacity-70">
                              {result.location.lat.toFixed(4)}°N, {result.location.lon.toFixed(4)}°E
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                      <Clock className="w-5 h-5 mt-0.5 text-purple-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-black">Last Updated</p>
                        <p className="text-sm text-muted-foreground">
                          {formatTimestamp(result.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                      <CloudRain className="w-5 h-5 mt-0.5 text-cyan-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-black">Cloud Type</p>
                        <p className="text-sm text-muted-foreground">
                          {result.cloudPattern?.type ? getCloudTypeName(result.cloudPattern.type) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                      <Cloud className="w-5 h-5 mt-0.5 text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-black">Cloud Coverage</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${getRiskColor(result.riskLevel)}`}
                            style={{ width: `${result.cloudPattern?.coverage || 0}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {result.cloudPattern?.coverage ? `${result.cloudPattern.coverage}%` : 'N/A'}
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
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold">{result.weather?.location || 'Global'}</span>
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

        {/* Weather and Cloud Analysis */}
        {result.weather && result.cloudPattern && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-black mb-2">
                Weather & Cloud Analysis
              </h3>
              <p className="text-muted-foreground">
                Environmental conditions and cloud pattern assessment
              </p>
            </div>
            <WeatherReport 
              weather={result.weather} 
              cloudPattern={result.cloudPattern} 
            />
          </div>
        )}

        {/* Cloudburst Risk Assessment */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Cloudburst Risk Assessment
            </h3>
            <p className="text-muted-foreground">
              Analysis of potential cloudburst events in the area
            </p>
          </div>
          {renderCloudburstRisk()}
        </div>
      </div>
    </section>
  );
};

export default AnalysisResults;