import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Zap, MapPin, AlertTriangle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      
      {/* Content */}
      <div className="relative z-10 container px-6 text-center">
        <div className="animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-primary-foreground" />
            <span className="text-primary-foreground/80 font-medium tracking-wide">
              GLOBAL FLOOD & WEATHER RECOGNITION SYSTEM
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            AI-Powered
            <span className="block bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
              Flood & Cloud Detection
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto mb-12 leading-relaxed">
            Advanced AI system for flood detection, cloud pattern analysis, and weather monitoring 
            to protect communities worldwide including Australia, India, and beyond
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-4 text-lg font-semibold shadow-elevated transition-spring"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Analysis
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-4 text-lg transition-smooth"
            >
              View Dashboard
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <Card className="bg-gradient-card backdrop-blur-sm border-primary-foreground/20 p-6 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Real-time Analysis</h3>
            </div>
            <p className="text-muted-foreground">
              Advanced AI analysis for flood detection and cloud pattern recognition
            </p>
          </Card>

          <Card className="bg-gradient-card backdrop-blur-sm border-primary-foreground/20 p-6 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-success/20 rounded-lg">
                <MapPin className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-lg">Global Coverage</h3>
            </div>
            <p className="text-muted-foreground">
              Worldwide monitoring including Australia, India, and other regions
            </p>
          </Card>

          <Card className="bg-gradient-card backdrop-blur-sm border-primary-foreground/20 p-6 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-warning/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-semibold text-lg">Weather & Cloud Analysis</h3>
            </div>
            <p className="text-muted-foreground">
              Real-time weather reports and cloud burst detection capabilities
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;