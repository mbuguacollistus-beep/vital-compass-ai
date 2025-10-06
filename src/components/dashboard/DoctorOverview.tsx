import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, AlertTriangle, FileText, Stethoscope, Clock, TrendingUp, Search, Brain, Mic } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const DoctorOverview = () => {
  const [stats, setStats] = useState({ patients: 0, todayVisits: 0, criticalCases: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      // Fetch total patients
      const { count: patientCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      // Fetch today's visits
      const today = new Date().toISOString().split('T')[0];
      const { count: todayVisitCount } = await supabase
        .from('medical_visits')
        .select('*', { count: 'exact', head: true })
        .eq('visit_date', today);

      // Fetch recent visits for activity
      const { data: recentVisits } = await supabase
        .from('medical_visits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      setStats({
        patients: patientCount || 0,
        todayVisits: todayVisitCount || 0,
        criticalCases: 0
      });

      setRecentActivity(recentVisits?.map(visit => ({
        patient: `Patient ${visit.patient_id.substring(0, 8)}`,
        action: `${visit.visit_type} - ${visit.reason_code || 'General consultation'}`,
        time: new Date(visit.created_at).toLocaleTimeString(),
        status: visit.visit_type === 'emergency' ? 'critical' : 'normal'
      })) || []);

    } catch (error: any) {
      console.error('Error fetching doctor data:', error);
      toast({
        title: "Error loading data",
        description: "Unable to fetch dashboard information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading dashboard...</div>;
  }

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
            <div className="text-2xl font-bold text-primary">{stats.patients}</div>
            <p className="text-xs text-muted-foreground">
              Total patients in system
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
            <div className="text-2xl font-bold">{stats.todayVisits}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled visits today
            </p>
            <Badge variant="outline" className="mt-2">
              View Schedule
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.criticalCases}</div>
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
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{recentActivity.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent patient interactions
            </p>
            <Badge variant="secondary" className="mt-2 bg-accent-light text-accent">
              Updated
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
                <div className="text-xl font-bold">{recentActivity.length}</div>
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
                <div className="text-xl font-bold">0</div>
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
                <div className="text-xl font-bold">{stats.patients}</div>
                <Button variant="ghost" size="sm" className="mt-2 w-full">Access Records</Button>
              </div>
            </Card>
          </div>

          {/* Recent Patient Activity */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Recent Patient Activity</h4>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            ) : (
              <div className="space-y-2">
                {recentActivity.map((activity, index) => (
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};