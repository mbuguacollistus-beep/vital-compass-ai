import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      title: "Health Tracking",
      description: "Track vitals, symptoms, and wellbeing daily",
      icon: "📝",
      color: "bg-gradient-primary"
    },
    {
      title: "Medical Records",
      description: "Store and access your health history",
      icon: "🏥",
      color: "bg-gradient-healing"
    },
    {
      title: "AI Insights",
      description: "Get intelligent health recommendations",
      icon: "🤖",
      color: "bg-accent"
    },
    {
      title: "Smart Alerts",
      description: "Receive timely health notifications",
      icon: "🚨",
      color: "bg-warning"
    },
    {
      title: "Care Network",
      description: "Share health data with your care team",
      icon: "👨‍👩‍👧‍👦",
      color: "bg-gradient-healing"
    },
    {
      title: "Medication Reminders",
      description: "Never miss your medications",
      icon: "💊",
      color: "bg-gradient-primary"
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Key Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for better healthcare
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="hover-lift border-0 shadow-card stagger-item group cursor-pointer"
                  role="article"
                  aria-label={`Feature: ${feature.title}`}>
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-500 ease-out`}>
                  <span className="text-white text-2xl" aria-hidden="true">{feature.icon}</span>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-all duration-300 ease-out">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;