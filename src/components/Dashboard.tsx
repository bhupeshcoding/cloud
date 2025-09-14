import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Activity, 
  AlertTriangle, 
  Shield, 
  Users, 
  Clock,
  TrendingUp,
  Zap,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  AlertOctagon
} from "lucide-react";
import { getWeatherByCoords, searchLocations, getLocationName } from '@/lib/api/weatherService';
import { getFloodAlerts, getFloodRisk } from "@/lib/api/floodService";
import { formatLastUpdated } from "@/lib/utils/date";

type RegionStatus = 'safe' | 'medium' | 'high' | 'extreme';

interface Region {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  status: RegionStatus;
  alerts: number;
  lastUpdated: Date;
  weather: {
    temp: number;
    condition: string;
    icon: string;
  };
}

interface SearchResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Could not get your location. Using default regions.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Using default regions.');
    }
  }, []);

  // Default regions to monitor
  const defaultRegions = [
    { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
    { name: "Mumbai", country: "India", lat: 19.0760, lon: 72.8777 },
    { name: "Perth", country: "Australia", lat: -31.9505, lon: 115.8605 },
    { name: "Dehradun", country: "India", lat: 30.3165, lon: 78.0322 },
    { name: "Brisbane", country: "Australia", lat: -27.4698, lon: 153.0251 },
    { name: "Chennai", country: "India", lat: 13.0827, lon: 80.2707 },
    { name: "Melbourne", country: "Australia", lat: -37.8136, lon: 144.9631 },
    { name: "New Delhi", country: "India", lat: 28.6139, lon: 77.2090 },
  ];

  const fetchWeatherData = useCallback(async (region: { name: string; country: string; lat: number; lon: number }) => {
    try {
      const [weather, floodAlerts, floodRisk] = await Promise.all([
        getWeatherByCoords(region.lat, region.lon),
        getFloodAlerts(region.name),
        getFloodRisk(region.lat, region.lon)
      ]);

      const status = floodRisk.riskLevel as RegionStatus;
      
      return {
        id: `${region.name}-${region.country}`.toLowerCase().replace(/\s+/g, '-'),
        name: region.name,
        country: region.country,
        lat: region.lat,
        lon: region.lon,
        status,
        alerts: floodAlerts.length,
        lastUpdated: new Date(),
        weather: {
          temp: Math.round(weather.main.temp),
          condition: weather.weather[0].main,
          icon: weather.weather[0].icon
        }
      };
    } catch (err) {
      console.error(`Error fetching data for ${region.name}:`, err);
      return null;
    }
  }, []);

  const loadRegionsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let regionsToLoad = [...defaultRegions];
      
      // Add user's current location as the first region if available
      if (userLocation) {
        try {
          // Reverse geocode to get location name
          const locationName = await getLocationName(userLocation.lat, userLocation.lon);
          regionsToLoad.unshift({
            name: locationName.name,
            country: locationName.country,
            lat: userLocation.lat,
            lon: userLocation.lon
          });
        } catch (err) {
          console.error('Error getting location name:', err);
          // Fallback to just showing coordinates if reverse geocoding fails
          regionsToLoad.unshift({
            name: 'Your Location',
            country: 'Current',
            lat: userLocation.lat,
            lon: userLocation.lon
          });
        }
      }
      
      const regionsData = await Promise.all(
        regionsToLoad.map(region => fetchWeatherData(region))
      );
      
      setRegions(regionsData.filter((region): region is NonNullable<typeof region> => region !== null));
    } catch (err) {
      setError('Failed to load region data. Please try again later.');
      console.error('Error loading regions:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [fetchWeatherData, userLocation]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    try {
      const results = await searchLocations(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  };

  const handleSelectRegion = async (result: SearchResult) => {
    setSearchQuery(`${result.name}, ${result.state || result.country}`);
    setShowSearchResults(false);
    
    try {
      setIsLoading(true);
      const regionData = await fetchWeatherData({
        name: result.name,
        country: result.country,
        lat: result.lat,
        lon: result.lon
      });
      
      if (regionData) {
        setSelectedRegion(regionData);
      }
    } catch (err) {
      console.error('Error selecting region:', err);
      setError('Failed to load region details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadRegionsData();
  };

  useEffect(() => {
    loadRegionsData();
  }, [loadRegionsData]);

  const getStatusColor = (status: RegionStatus) => {
    switch (status) {
      case 'safe': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      case 'extreme': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusBg = (status: RegionStatus) => {
    switch (status) {
      case 'safe': return 'bg-success/10';
      case 'medium': return 'bg-warning/10';
      case 'high': return 'bg-destructive/10';
      case 'extreme': return 'bg-destructive/20';
      default: return 'bg-muted';
    }
  };
  
  const getStatusIcon = (status: RegionStatus) => {
    switch (status) {
      case 'safe':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'high':
      case 'extreme':
        return <AlertOctagon className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const renderRegionCard = (region: Region) => (
    <div 
      key={region.id}
      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
        getStatusBg(region.status)
      } ${selectedRegion?.id === region.id ? 'ring-2 ring-primary' : ''}`}
      onClick={() => setSelectedRegion(region)}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {region.weather?.icon ? (
            <img 
              src={`https://openweathermap.org/img/wn/${region.weather.icon}@2x.png`} 
              alt={region.weather.condition}
              className="w-12 h-12"
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded-full" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-lg">{region.name}, {region.country}</span>
          <span className="text-sm text-muted-foreground">
            {region.weather ? `${region.weather.temp}°C • ${region.weather.condition}` : 'No weather data'}
          </span>
          <span className="text-xs text-muted-foreground">
            Updated {formatLastUpdated(region.lastUpdated)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Active Alerts</p>
          <p className="text-xl font-bold">{region.alerts}</p>
        </div>
        <Badge 
          variant="outline" 
          className={`flex items-center gap-1 ${
            region.status === 'safe' ? 'border-success text-success' :
            region.status === 'medium' ? 'border-warning text-warning' :
            'border-destructive text-destructive'
          }`}
        >
          {getStatusIcon(region.status)}
          {region.status.toUpperCase()}
        </Badge>
      </div>
    </div>
  );

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {Array(5).fill(0).map((_, i) => (
        <Skeleton key={i} className="w-full h-24 rounded-lg" />
      ))}
    </div>
  );

  return (
    <section className="py-12 bg-muted/20 min-h-screen">
      <div className="container px-4 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Global Monitoring Dashboard
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Real-time monitoring of flood conditions, weather, and cloud patterns worldwide
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for a location..."
                className="pl-10 pr-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground rounded-md shadow-lg border">
                {searchResults.map((result) => (
                  <div
                    key={`${result.lat},${result.lon}`}
                    className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSelectRegion(result)}
                  >
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.state ? `${result.state}, ` : ''}{result.country}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm border-0 bg-gradient-success">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-success-foreground/80 text-sm font-medium">Regions Monitored</p>
                  <p className="text-2xl font-bold text-success-foreground">{regions.length}</p>
                </div>
                <Shield className="w-7 h-7 text-success-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-gradient-alert">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-warning-foreground text-sm font-medium">Active Alerts</p>
                  <p className="text-2xl font-bold text-warning-foreground">
                    {regions.reduce((sum, region) => sum + region.alerts, 0)}
                  </p>
                </div>
                <AlertTriangle className="w-7 h-7 text-warning-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-gradient-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">High Risk Areas</p>
                  <p className="text-2xl font-bold text-primary-foreground">
                    {regions.filter(r => r.status === 'high' || r.status === 'extreme').length}
                  </p>
                </div>
                <Users className="w-7 h-7 text-primary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-gradient-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Last Updated</p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <Activity className="w-7 h-7 text-primary/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Region List */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    Regional Status Monitor
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  renderLoadingSkeleton()
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-destructive mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-1">Unable to load data</h3>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <Button onClick={handleRefresh} disabled={isRefreshing}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Try again
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {regions.length > 0 ? (
                      regions.map(renderRegionCard)
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No regions found. Try adding some locations.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Region Details */}
            {selectedRegion && (
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    {selectedRegion.name}, {selectedRegion.country}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(selectedRegion.status)}
                          <span className="font-medium capitalize">
                            Updated {formatLastUpdated(selectedRegion.lastUpdated)}
                            {selectedRegion.status} Risk
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="text-2xl font-bold">
                          {selectedRegion.weather?.temp}°C
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Weather</p>
                      <div className="flex items-center gap-3">
                        {selectedRegion.weather?.icon ? (
                          <img 
                            src={`https://openweathermap.org/img/wn/${selectedRegion.weather.icon}@2x.png`} 
                            alt={selectedRegion.weather.condition}
                            className="w-16 h-16 -my-2 -ml-2"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded-full" />
                        )}
                        <div>
                          <p className="text-lg font-medium capitalize">
                            {selectedRegion.weather?.condition.toLowerCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedRegion.alerts} active alert{selectedRegion.alerts !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-2" size="sm">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      View Full Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Send Alert
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  {regions
                    .filter(region => region.alerts > 0)
                    .sort((a, b) => b.alerts - a.alerts)
                    .slice(0, 3)
                    .map((region) => (
                      <div key={region.id} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          region.status === 'safe' ? 'bg-success' :
                          region.status === 'medium' ? 'bg-warning' :
                          'bg-destructive'
                        }`}></div>
                        <div>
                          <p className="font-medium">
                            {region.alerts} new alert{region.alerts !== 1 ? 's' : ''} in {region.name}
                          </p>
                          <p className="text-muted-foreground">
                            {region.name}, {region.country} • {region.lastUpdate}
                          </p>
                        </div>
                      </div>
                    ))}
                  
                  {regions.filter(region => region.alerts > 0).length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No recent alerts. All regions are currently stable.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;