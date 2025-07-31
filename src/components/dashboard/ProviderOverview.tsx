import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, AlertTriangle, BarChart3 } from 'lucide-react';

export const ProviderOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Patients</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">247</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-accent">+12</span> new this month
          </p>
          <Badge variant="secondary" className="mt-2 bg-primary-muted text-primary">
            Active Patients
          </Badge>
        </CardContent>
      </Card>
      
      <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-accent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
          <Calendar className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">14</div>
          <p className="text-xs text-muted-foreground">
            Next: <span className="font-medium">10:30 AM</span>
          </p>
          <Badge variant="outline" className="mt-2">
            Sarah Johnson - Follow-up
          </Badge>
        </CardContent>
      </Card>
      
      <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-warning">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Priority Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">5</div>
          <p className="text-xs text-muted-foreground">
            Require immediate attention
          </p>
          <Badge variant="outline" className="mt-2 border-warning text-warning">
            High Priority
          </Badge>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-destructive">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Stats</CardTitle>
          <BarChart3 className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">94%</div>
          <p className="text-xs text-muted-foreground">
            Patient satisfaction rate
          </p>
          <Badge variant="secondary" className="mt-2 bg-accent-light text-accent">
            Excellent
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};