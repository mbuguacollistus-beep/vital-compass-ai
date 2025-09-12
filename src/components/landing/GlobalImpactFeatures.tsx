import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Globe, Smartphone, Heart, Shield } from "lucide-react";

const impactFeatures = [
  {
    icon: MapPin,
    title: "Global Health Access",
    description: "Bridge healthcare gaps in remote areas worldwide with telemedicine and mobile clinics coordination.",
    impact: "500M+ people",
    badge: "High Impact"
  },
  {
    icon: Users,
    title: "Community Health Workers",
    description: "Empower CHWs globally with AI-driven decision support and patient tracking tools.",
    impact: "100K+ CHWs",
    badge: "Scalable"
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Healthcare in 50+ languages including English, Spanish, French, Arabic, Chinese, and more.",
    impact: "50+ languages",
    badge: "Inclusive"
  },
  {
    icon: Smartphone,
    title: "Offline-First Design",
    description: "Works without internet. Sync when connected. Perfect for areas with poor connectivity worldwide.",
    impact: "100% offline",
    badge: "Reliable"
  },
  {
    icon: Heart,
    title: "Universal Health Focus",
    description: "Comprehensive healthcare tools for all demographics in resource-limited and advanced settings.",
    impact: "Lives saved",
    badge: "Critical"
  },
  {
    icon: Shield,
    title: "Disease Surveillance",
    description: "Global early warning systems for outbreak detection and public health monitoring.",
    impact: "Real-time alerts",
    badge: "Prevention"
  }
];

export const GlobalImpactFeatures = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
            Global Impact
          </Badge>
          <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Healthcare Innovation for Everyone
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Designed for global healthcare challenges, built with international communities and healthcare providers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-primary/10 hover:shadow-lg transition-all duration-300 border-primary/10">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center group-hover:bg-gradient-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-primary"></div>
                    <span className="text-sm font-medium text-primary">
                      {feature.impact}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-full px-6 py-3 border border-accent/20">
            <Globe className="w-5 h-5 text-accent" />
            <span className="text-accent-foreground font-medium">
              Serving healthcare systems worldwide with intelligent technology solutions
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};