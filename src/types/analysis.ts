export interface CloudPattern {
  detected: boolean;
  type: 'cumulus' | 'cumulonimbus' | 'stratus' | 'cirrus';
  cloudBurstRisk: 'low' | 'medium' | 'high' | 'extreme';
  coverage: number;
  windShear?: number;
  moistureContent?: number;
  confidence?: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  location: string;
}

export interface AnalysisResult {
  floodDetected: boolean;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  affectedArea: number;
  timestamp: string;
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  cloudPattern?: CloudPattern;
  weather?: WeatherData;
}

export interface CloudburstRiskData {
  risk: 'low' | 'moderate' | 'high' | 'extreme';
  confidence: number;
  cloudType?: string;
  windShear?: number;
  moistureContent?: number;
}

export interface AnalysisResultsProps {
  result: AnalysisResult;
  cloudburstRisk: CloudburstRiskData | null;
  isLoading: boolean;
}
