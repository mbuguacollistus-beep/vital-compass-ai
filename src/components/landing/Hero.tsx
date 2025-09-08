import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-healthcare.jpg";
import nixLogo from "@/assets/nix-ai-logo.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Healthcare environment showcasing modern medical technology and patient care" 
          className="w-full h-full object-cover opacity-10"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="flex items-center justify-center mb-8 fade-in">
          <img 
            src={nixLogo} 
            alt="Nix AI Healthcare logo" 
            className="w-16 h-16 mr-4 hover-scale"
            loading="eager"
          />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Nix AI
          </h1>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 max-w-4xl mx-auto fade-in" style={{animationDelay: "0.2s"}}>
          Intelligent Patient History & Care Coordinator
        </h2>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed fade-in" style={{animationDelay: "0.4s"}}>
          Your personal health historian that tracks trends, detects patterns, and coordinates care across your entire healthcare journey. Secure, intelligent, and always by your side.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in" style={{animationDelay: "0.6s"}}>
          <Button 
            variant="medical" 
            size="lg"
            className="text-lg px-8 py-3 hover-glow"
            onClick={() => window.location.href = '/auth'}
            aria-label="Get started with Nix AI Healthcare platform"
          >
            Start Your Health Journey
          </Button>
          <Button 
            variant="soft" 
            size="lg"
            className="text-lg px-8 py-3"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Learn more about our features"
          >
            Learn More
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center fade-in group">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 hover-scale group-hover:shadow-primary transition-smooth">
              <span className="text-white text-2xl" aria-hidden="true">📊</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-smooth">Trend Analysis</h3>
            <p className="text-muted-foreground">AI-powered pattern detection in your health data</p>
          </div>
          
          <div className="text-center fade-in group" style={{animationDelay: "0.2s"}}>
            <div className="w-12 h-12 bg-gradient-healing rounded-full flex items-center justify-center mx-auto mb-4 hover-scale group-hover:shadow-primary transition-smooth">
              <span className="text-white text-2xl" aria-hidden="true">🤝</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-smooth">Care Coordination</h3>
            <p className="text-muted-foreground">Connect with family, caregivers, and clinicians</p>
          </div>
          
          <div className="text-center fade-in group" style={{animationDelay: "0.4s"}}>
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 hover-scale group-hover:shadow-primary transition-smooth">
              <span className="text-white text-2xl" aria-hidden="true">🔒</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-smooth">Secure & Private</h3>
            <p className="text-muted-foreground">Bank-level encryption with full data control</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;