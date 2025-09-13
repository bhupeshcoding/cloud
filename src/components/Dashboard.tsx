import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Activity, 
  AlertTriangle, 
  Shield, 
  Users, 
  Clock,
  TrendingUp,
  Zap
} from "lucide-react";

const Dashboard = () => {
  const districts = [
    { name: "Dehradun", status: "safe", alerts: 0, lastUpdate: "2 min ago" },
    { name: "Haridwar", status: "medium", alerts: 2, lastUpdate: "5 min ago" },
    { name: "Pauri Garhwal", status: "high", alerts: 5, lastUpdate: "1 min ago" },
    { name: "Tehri Garhwal", status: "safe", alerts: 0, lastUpdate: "3 min ago" },
    { name: "Uttarkashi", status: "medium", alerts: 1, lastUpdate: "7 min ago" },
    { name: "Chamoli", status: "safe", alerts: 0, lastUpdate: "4 min ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-success/10';
      case 'medium': return 'bg-warning/10';
      case 'high': return 'bg-destructive/10';
      default: return 'bg-muted';
    }
  };

  return (
    <section className="py-20 bg-muted/20">
      <div className="container px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Emergency Dashboard
          </h2>
          <p className="text-xl text-muted-foreground">
            Real-time monitoring of flood conditions across Uttarakhand
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-card border-0 bg-gradient-success">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-success-foreground/80 text-sm font-medium">Districts Safe</p>
                  <p className="text-3xl font-bold text-success-foreground">11</p>
                </div>
                <Shield className="w-8 h-8 text-success-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-gradient-alert">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-warning-foreground text-sm font-medium">Active Alerts</p>
                  <p className="text-3xl font-bold text-warning-foreground">8</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-gradient-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">People Protected</p>
                  <p className="text-3xl font-bold text-primary-foreground">1.2M</p>
                </div>
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">System Uptime</p>
                  <p className="text-3xl font-bold text-foreground">99.9%</p>
                </div>
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* District Status */}
          <div className="lg:col-span-2">
            <Card className="shadow-elevated border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  District-wise Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {districts.map((district, index) => (
                    <div 
                      key={district.name}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${getStatusBg(district.status)}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-lg">{district.name}</span>
                          <span className="text-sm text-muted-foreground">
                            Updated {district.lastUpdate}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Active Alerts</p>
                          <p className="text-xl font-bold">{district.alerts}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`${
                            district.status === 'safe' ? 'border-success text-success' :
                            district.status === 'medium' ? 'border-warning text-warning' :
                            'border-destructive text-destructive'
                          }`}
                        >
                          {district.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-primary" size="sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Send Alert
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  View Map
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">High risk alert issued</p>
                      <p className="text-muted-foreground">Pauri Garhwal • 2 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Area cleared as safe</p>
                      <p className="text-muted-foreground">Dehradun • 15 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Monitoring alert issued</p>
                      <p className="text-muted-foreground">Haridwar • 32 min ago</p>
                    </div>
                  </div>
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