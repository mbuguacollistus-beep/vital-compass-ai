import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto mb-4 animate-pulse bg-gradient-primary rounded-full"></div>
          <h2 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
            Nix AI Healthcare
          </h2>
          <p className="text-muted-foreground">Loading your health companion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <CallToAction />
    </div>
  );
};

export default Index;
