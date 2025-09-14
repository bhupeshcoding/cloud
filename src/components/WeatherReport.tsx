import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  MapPin,
  CloudRain,
  Sun,
  CloudSnow
} from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  location: string;
}

interface CloudPattern {
  detected: boolean;
  type: 'cumulus' | 'cumulonimbus' | 'stratus' | 'cirrus';
  cloudBurstRisk: 'low' | 'medium' | 'high' | 'extreme';
  coverage: number;
  windShear?: number;
  moistureContent?: number;
  confidence?: number;
}

interface WeatherReportProps {
  weather: WeatherData;
  cloudPattern: CloudPattern;
}

const WeatherReport = ({ weather, cloudPattern }: WeatherReportProps) => {
  const getCloudIcon = (type: string) => {
    switch (type) {
      case 'cumulonimbus': return CloudRain;
      case 'cumulus': return Cloud;
      case 'stratus': return CloudSnow;
      case 'cirrus': return Sun;
      default: return Cloud;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      case 'extreme': return 'destructive';
      default: return 'secondary';
    }
  };

  const CloudIcon = getCloudIcon(cloudPattern.type);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Weather Conditions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Weather Report
          </CardTitle>
          <p className="text-sm text-muted-foreground">{weather.location}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Thermometer className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-lg font-semibold">{weather.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Droplets className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-lg font-semibold">{weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Wind className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Wind Speed</p>
                <p className="text-lg font-semibold">{weather.windSpeed} km/h</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Gauge className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pressure</p>
                <p className="text-lg font-semibold">{weather.pressure} hPa</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cloud Pattern Analysis */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudIcon className="w-5 h-5 text-primary" />
            Cloud Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cloudPattern.detected ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cloud Type</span>
                <Badge variant="outline" className="capitalize">
                  {cloudPattern.type}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Coverage</span>
                <span className="font-semibold">{cloudPattern.coverage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cloud Burst Risk</span>
                <Badge variant={getRiskColor(cloudPattern.cloudBurstRisk) as any}>
                  {cloudPattern.cloudBurstRisk.toUpperCase()}
                </Badge>
              </div>
              
              {/* Cloud Type Description */}
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Cloud Analysis</h4>
                <p className="text-xs text-muted-foreground">
                  {cloudPattern.type === 'cumulonimbus' && 
                    'Towering clouds often associated with severe weather, thunderstorms, and heavy rainfall.'
                  }
                  {cloudPattern.type === 'cumulus' && 
                    'Fair weather clouds with puffy appearance, generally indicating stable conditions.'
                  }
                  {cloudPattern.type === 'stratus' && 
                    'Low, gray clouds that often produce light precipitation over wide areas.'
                  }
                  {cloudPattern.type === 'cirrus' && 
                    'High, thin clouds made of ice crystals, usually indicating fair weather.'
                  }
                </p>
              </div>

              {cloudPattern.cloudBurstRisk === 'high' && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-semibold text-destructive">High Cloud Burst Risk</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Monitor weather conditions closely and prepare for potential heavy rainfall.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <Cloud className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No significant cloud patterns detected</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherReport;