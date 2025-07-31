import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, TrendingUp, Activity } from 'lucide-react';

export const PatientOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-accent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Well-being Score</CardTitle>
          <Heart className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">8.2/10</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-accent">+0.3</span> from yesterday
          </p>
          <Badge variant="secondary" className="mt-2 bg-accent-light text-accent">
            Excellent
          </Badge>
        </CardContent>
      </Card>
      
      <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Visits</CardTitle>
          <Calendar className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">
            Next: <span className="font-medium">Tomorrow 2:00 PM</span>
          </p>
          <Badge variant="outline" className="mt-2">
            Dr. Smith - Cardiology
          </Badge>
        </CardContent>
      </Card>
      
      <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-warning">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Health Trends</CardTitle>
          <TrendingUp className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">Improving</div>
          <p className="text-xs text-muted-foreground">
            7-day average trend
          </p>
          <Badge variant="secondary" className="mt-2 bg-accent-light text-accent">
            +12% this week
          </Badge>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-destructive">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vital Signs</CardTitle>
          <Activity className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Normal</div>
          <p className="text-xs text-muted-foreground">
            Last reading: <span className="font-medium">2 hours ago</span>
          </p>
          <div className="flex gap-1 mt-2">
            <Badge variant="outline" className="text-xs">BP: 120/80</Badge>
            <Badge variant="outline" className="text-xs">HR: 72</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};