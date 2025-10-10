import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Users, DollarSign, TrendingUp, Activity, Calendar, AlertTriangle, BarChart3 } from 'lucide-react';
import { HospitalDataAnalytics } from '@/components/analytics/HospitalDataAnalytics';
import { supabase } from '@/integrations/supabase/client';

export const HospitalAdminOverview = () => {
  const [patientCount, setPatientCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count: patients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });
    
    const { count: visits } = await supabase
      .from('medical_visits')
      .select('*', { count: 'exact', head: true });

    setPatientCount(patients || 0);
    setVisitCount(visits || 0);
  };
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Data Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{patientCount}</div>
            <p className="text-xs text-muted-foreground">
              Total registered patients
            </p>
            <Badge variant="secondary" className="mt-2 bg-primary-muted text-primary">
              85% Capacity
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Building className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              Current shift: <span className="font-medium">Day shift</span>
            </p>
            <Badge variant="outline" className="mt-2">
              98% Attendance
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <DollarSign className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">$127K</div>
            <p className="text-xs text-muted-foreground">
              Target: $120K per day
            </p>
            <Badge variant="secondary" className="mt-2 bg-accent-light text-accent">
              +6% above target
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">7</div>
            <p className="text-xs text-muted-foreground">
              Requires admin attention
            </p>
            <Badge variant="outline" className="mt-2 border-warning text-warning">
              Review Required
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Hospital Operations Dashboard */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Hospital Operations Dashboard
              </CardTitle>
              <CardDescription>
                Monitor hospital performance, resources, and operational metrics
              </CardDescription>
            </div>
            <Button size="sm" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              View Reports
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 hover:shadow-md transition-all duration-200 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Bed Occupancy</h4>
                  <p className="text-xs text-muted-foreground">Available beds</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold">187/220</div>
                <Button variant="ghost" size="sm" className="mt-2 w-full">Manage Beds</Button>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-all duration-200 border-accent/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Scheduled Surgery</h4>
                  <p className="text-xs text-muted-foreground">Today's operations</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold">23</div>
                <Button variant="ghost" size="sm" className="mt-2 w-full">View Schedule</Button>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-all duration-200 border-warning/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Insurance Claims</h4>
                  <p className="text-xs text-muted-foreground">Pending review</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold">42</div>
                <Button variant="ghost" size="sm" className="mt-2 w-full">Process Claims</Button>
              </div>
            </Card>
          </div>

          {/* Department Performance */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Department Performance</h4>
            <div className="space-y-2">
              {[
                { department: "Emergency Department", metric: "Wait time: 15 min", status: "excellent", change: "-5 min" },
                { department: "Surgery", metric: "Operations completed: 18/23", status: "good", change: "On schedule" },
                { department: "ICU", metric: "Occupancy: 92%", status: "high", change: "+12%" },
                { department: "Radiology", metric: "Scans completed: 156", status: "excellent", change: "+8%" }
              ].map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      dept.status === 'excellent' ? 'bg-accent' :
                      dept.status === 'good' ? 'bg-primary' :
                      dept.status === 'high' ? 'bg-warning' :
                      'bg-accent'
                    }`}></div>
                    <div>
                      <p className="font-medium text-sm">{dept.department}</p>
                      <p className="text-xs text-muted-foreground">{dept.metric}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{dept.change}</p>
                    <Button variant="ghost" size="sm" className="text-xs">Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="analytics">
        <HospitalDataAnalytics />
      </TabsContent>
    </Tabs>
  );
};