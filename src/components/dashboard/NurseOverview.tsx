import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Clock, AlertCircle, CheckCircle, Stethoscope, Clipboard, TrendingUp, Bell } from 'lucide-react';

export const NurseOverview = () => {
  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Patients</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">18</div>
            <p className="text-xs text-muted-foreground">
              Active in your care
            </p>
            <Badge variant="secondary" className="mt-2 bg-primary-muted text-primary">
              Current Shift
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medication Rounds</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              Next round: <span className="font-medium">11:00 AM</span>
            </p>
            <Badge variant="outline" className="mt-2">
              3 patients pending
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">2</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
            <Badge variant="outline" className="mt-2 border-warning text-warning">
              High Priority
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">24/28</div>
            <p className="text-xs text-muted-foreground">
              85% completion rate
            </p>
            <Badge variant="secondary" className="mt-2 bg-accent-light text-accent">
              On Track
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Patient Care Management */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Patient Care Management
              </CardTitle>
              <CardDescription>
                Monitor patient vitals, medications, and care protocols
              </CardDescription>
            </div>
            <Button size="sm" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              View Alerts
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 hover:shadow-md transition-all duration-200 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clipboard className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Vital Signs</h4>
                  <p className="text-xs text-muted-foreground">Due readings</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold">8</div>
                <Button variant="ghost" size="sm" className="mt-2 w-full">Record Vitals</Button>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-all duration-200 border-accent/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Medication Admin</h4>
                  <p className="text-xs text-muted-foreground">Scheduled doses</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold">12</div>
                <Button variant="ghost" size="sm" className="mt-2 w-full">Administer</Button>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-all duration-200 border-warning/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Care Plans</h4>
                  <p className="text-xs text-muted-foreground">Active protocols</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold">18</div>
                <Button variant="ghost" size="sm" className="mt-2 w-full">Update Plans</Button>
              </div>
            </Card>
          </div>

          {/* Recent Patient Updates */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Recent Patient Updates</h4>
            <div className="space-y-2">
              {[
                { patient: "Emma Thompson", status: "Vitals recorded", time: "30 min ago", priority: "normal" },
                { patient: "Robert Davis", status: "Medication administered", time: "1 hour ago", priority: "normal" },
                { patient: "Lisa Chen", status: "Pain assessment completed", time: "1.5 hours ago", priority: "normal" },
                { patient: "John Martinez", status: "Blood pressure elevated", time: "2 hours ago", priority: "urgent" }
              ].map((update, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      update.priority === 'urgent' ? 'bg-warning' : 'bg-accent'
                    }`}></div>
                    <div>
                      <p className="font-medium text-sm">{update.patient}</p>
                      <p className="text-xs text-muted-foreground">{update.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{update.time}</p>
                    <Button variant="ghost" size="sm" className="text-xs">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};