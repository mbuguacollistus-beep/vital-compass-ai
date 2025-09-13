import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, AlertTriangle, FileText, Stethoscope, Clock, TrendingUp, Search, Brain, Mic } from 'lucide-react';

export const DoctorOverview = () => {
  return (
    <div className="space-y-6">
      {/* AI Tools Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Smart Consultation Assistant
            </CardTitle>
            <CardDescription>AI-powered diagnostic support and clinical guidelines</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Launch AI Assistant</Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-card border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-accent" />
              Voice Transcription
            </CardTitle>
            <CardDescription>Convert consultations to structured SOAP notes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">Start Recording</Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Stats Grid */}
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
            <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
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
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">94%</div>
            <p className="text-xs text-muted-foreground">
              Treatment success rate
            </p>
            <Badge variant="secondary" className="mt-2 bg-accent-light text-accent">
              Excellent
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Patient History Access Section */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Patient History Center
              </CardTitle>
              <CardDescription>
                Access comprehensive patient medical histories and treatment records
              </CardDescription>
            </div>
            <Button size="sm" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 hover:shadow-md transition-all duration-200 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Recent Consultations</h4>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold">142</div>
                <Button variant="ghost" size="sm" className="mt-2 w-full">View All</Button>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-all duration-200 border-accent/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Pending Reviews</h4>
                  <p className="text-xs text-muted-foreground">Awaiting attention</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold">23</div>
                <Button variant="ghost" size="sm" className="mt-2 w-full">Review Now</Button>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-all duration-200 border-warning/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Medical Records</h4>
                  <p className="text-xs text-muted-foreground">Complete histories</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold">1,247</div>
                <Button variant="ghost" size="sm" className="mt-2 w-full">Access Records</Button>
              </div>
            </Card>
          </div>

          {/* Recent Patient Activity */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Recent Patient Activity</h4>
            <div className="space-y-2">
              {[
                { patient: "Sarah Johnson", action: "Lab results uploaded", time: "2 hours ago", status: "urgent" },
                { patient: "Michael Chen", action: "Prescription refill request", time: "4 hours ago", status: "normal" },
                { patient: "Maria Garcia", action: "Appointment rescheduled", time: "6 hours ago", status: "normal" },
                { patient: "James Wilson", action: "Emergency visit completed", time: "8 hours ago", status: "critical" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'urgent' ? 'bg-warning' :
                      activity.status === 'critical' ? 'bg-destructive' :
                      'bg-accent'
                    }`}></div>
                    <div>
                      <p className="font-medium text-sm">{activity.patient}</p>
                      <p className="text-xs text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    <Button variant="ghost" size="sm" className="text-xs">View</Button>
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