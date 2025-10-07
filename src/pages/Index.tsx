import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import { GlobalImpactFeatures } from "@/components/landing/GlobalImpactFeatures";
import CallToAction from "@/components/landing/CallToAction";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary shadow-primary pulse-glow"></div>
            <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-primary opacity-30 animate-ping"></div>
          </div>
          <div className="space-y-2 fade-in">
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Nix AI Healthcare
            </h2>
            <p className="text-muted-foreground text-sm">
              Connecting global healthcare ecosystems...
            </p>
          </div>
          <div className="w-full bg-secondary/20 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-gradient-primary rounded-full animate-pulse shimmer"></div>
          </div>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      <Hero />
      <Features />
      <CallToAction />
    </div>
  );
};

export default Index;
