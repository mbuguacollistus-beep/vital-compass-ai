import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      title: "Daily Well-Being Tracking",
      description: "Simple 1-10 scale tracking with symptom logs and automated pattern recognition",
      icon: "📝",
      color: "bg-gradient-primary"
    },
    {
      title: "Hospital Visit Integration",
      description: "Automatic import of clinic visits, dates, locations, and reason codes",
      icon: "🏥",
      color: "bg-gradient-healing"
    },
    {
      title: "Wearable Device Sync",
      description: "Connect heart rate, sleep, and activity data from your favorite devices",
      icon: "⌚",
      color: "bg-gradient-primary"
    },
    {
      title: "Predictive Alerts",
      description: "Customizable thresholds with multi-channel notifications (SMS, email, WhatsApp)",
      icon: "🚨",
      color: "bg-warning"
    },
    {
      title: "Family Care Network",
      description: "Secure sharing with family members and caregivers via time-limited access",
      icon: "👨‍👩‍👧‍👦",
      color: "bg-gradient-healing"
    },
    {
      title: "Clinical Reports",
      description: "One-click PDF generation for healthcare providers with complete timeline",
      icon: "📋",
      color: "bg-gradient-primary"
    },
    {
      title: "AI Health Companion",
      description: "Chat with your personal health assistant about patterns and insights",
      icon: "🤖",
      color: "bg-accent"
    },
    {
      title: "Medication Management",
      description: "Smart reminders, refill tracking, and automated pharmacy integration",
      icon: "💊",
      color: "bg-gradient-healing"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Complete Health Management Suite
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to track, understand, and coordinate your healthcare in one intelligent platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-card transition-smooth border-0 shadow-card">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white text-2xl">{feature.icon}</span>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
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