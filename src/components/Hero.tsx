import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Camera, Clock } from "lucide-react";
import heroImage from "@/assets/civic-hero.jpg";
import AnimatedBackground from "@/components/AnimatedBackground";
import AnimatedHero from "@/components/AnimatedHero";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Students reporting college issues" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        
        {/* Animated Background Elements */}
        <AnimatedBackground />
        <AnimatedHero />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm font-medium text-secondary">Your Voice Matters</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Report College Issue
            <span className="block text-primary">Improve Campus Life</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Infrastructure, Study Material, Teaching, Office, Cleaning, and More...
          </p>
          
          <p className="text-sm text-muted-foreground mb-8 italic">
            A Student-Driven Platform to Improve Campus Life
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary-hover text-lg px-8 py-4" onClick={() => document.getElementById('report')?.scrollIntoView({behavior: 'smooth'})}>
              Report an Issue
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4" onClick={() => window.location.href = '/track-complaint'}>
              Track My Reports
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Auto Location</h3>
                <p className="text-sm text-muted-foreground">GPS tracking</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-light flex items-center justify-center">
                <Camera className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Photo Upload</h3>
                <p className="text-sm text-muted-foreground">Visual evidence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-status-progress/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-status-progress" />
              </div>
              <div>
                <h3 className="font-semibold">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">Track progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;