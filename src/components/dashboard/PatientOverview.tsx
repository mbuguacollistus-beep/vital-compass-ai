import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, TrendingUp, Activity, Search, FileText, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export const PatientOverview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({ wellbeingScore: 0, upcomingVisits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPatientData();
    }
  }, [user]);

  const fetchPatientData = async () => {
    try {
      // Get patient ID
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (patientData) {
        // Fetch latest wellbeing entry
        const { data: wellbeingData } = await supabase
          .from('wellbeing_entries')
          .select('score')
          .eq('patient_id', patientData.id)
          .order('date_recorded', { ascending: false })
          .limit(1)
          .single();

        // Fetch upcoming visits
        const today = new Date().toISOString().split('T')[0];
        const { count: visitCount } = await supabase
          .from('medical_visits')
          .select('*', { count: 'exact', head: true })
          .eq('patient_id', patientData.id)
          .gte('visit_date', today);

        setStats({
          wellbeingScore: wellbeingData?.score || 0,
          upcomingVisits: visitCount || 0
        });
      }
    } catch (error: any) {
      console.error('Error fetching patient data:', error);
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
      {/* AI Health Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-card border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="h-4 w-4" />
              Symptom Checker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full">Check Symptoms</Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-card border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Health Journal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" variant="outline" className="w-full">Add Entry</Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-card border-l-4 border-l-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" variant="outline" className="w-full">View All</Button>
          </CardContent>
        </Card>
      </div>

      {/* Health Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-accent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Well-being Score</CardTitle>
          <Heart className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{stats.wellbeingScore ? `${stats.wellbeingScore}/10` : 'Not recorded'}</div>
          <p className="text-xs text-muted-foreground">
            Track your daily wellbeing
          </p>
          <Badge variant="secondary" className="mt-2 bg-accent-light text-accent">
            {stats.wellbeingScore >= 8 ? 'Excellent' : stats.wellbeingScore >= 6 ? 'Good' : stats.wellbeingScore >= 4 ? 'Fair' : 'Needs Attention'}
          </Badge>
        </CardContent>
      </Card>
      
      <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Visits</CardTitle>
          <Calendar className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcomingVisits}</div>
          <p className="text-xs text-muted-foreground">
            Scheduled appointments
          </p>
          <Badge variant="outline" className="mt-2">
            View Schedule
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
    </div>
  );
};