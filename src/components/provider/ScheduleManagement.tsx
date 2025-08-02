import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, User, Plus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, isToday, isFuture } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Visit {
  id: string;
  visit_date: string;
  visit_type: string;
  reason_code: string | null;
  diagnosis: string | null;
  treatment_notes: string | null;
  patients: {
    patient_number: string;
    profiles: {
      full_name: string | null;
      email: string;
    };
  };
}

export const ScheduleManagement = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVisits();
  }, []);

  useEffect(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const filtered = visits.filter(visit => visit.visit_date === dateStr);
    setFilteredVisits(filtered);
  }, [selectedDate, visits]);

  const fetchVisits = async () => {
    try {
      const { data: visits, error } = await supabase
        .from('medical_visits')
        .select('*')
        .order('visit_date', { ascending: true });

      if (error) throw error;

      // Get patient and profile data for each visit
      const visitsWithDetails = await Promise.all(
        (visits || []).map(async (visit) => {
          const { data: patient } = await supabase
            .from('patients')
            .select('patient_number, user_id')
            .eq('id', visit.patient_id)
            .maybeSingle();

          if (patient) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('user_id', patient.user_id)
              .maybeSingle();

            return {
              ...visit,
              patients: {
                patient_number: patient.patient_number,
                profiles: profile
              }
            };
          }

          return {
            ...visit,
            patients: {
              patient_number: 'Unknown',
              profiles: { full_name: 'Unknown Patient', email: 'unknown@email.com' }
            }
          };
        })
      );
      
      setVisits(visitsWithDetails as Visit[]);
    } catch (error) {
      console.error('Error fetching visits:', error);
      toast({
        title: "Error",
        description: "Failed to load schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getVisitStatusBadge = (visitDate: string) => {
    const date = new Date(visitDate);
    if (isToday(date)) {
      return <Badge variant="default">Today</Badge>;
    } else if (isFuture(date)) {
      return <Badge variant="secondary">Upcoming</Badge>;
    } else {
      return <Badge variant="outline">Completed</Badge>;
    }
  };

  const getVisitTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'routine':
        return 'bg-blue-100 text-blue-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'follow-up':
        return 'bg-green-100 text-green-800';
      case 'consultation':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-muted-foreground">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Schedule Management</h2>
          <p className="text-muted-foreground">Manage appointments and visits</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Selected Date Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Schedule for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
            <CardDescription>
              {filteredVisits.length} {filteredVisits.length === 1 ? 'appointment' : 'appointments'} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredVisits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No appointments scheduled for this date</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVisits.map((visit) => (
                  <Card key={visit.id} className="p-4 border-l-4 border-l-primary">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={getVisitTypeColor(visit.visit_type)}>
                            {visit.visit_type}
                          </Badge>
                          {getVisitStatusBadge(visit.visit_date)}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {visit.patients?.profiles?.full_name || 'Unknown Patient'}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            (#{visit.patients?.patient_number})
                          </span>
                        </div>
                        
                        {visit.reason_code && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Reason:</strong> {visit.reason_code}
                          </p>
                        )}
                        
                        {visit.diagnosis && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Diagnosis:</strong> {visit.diagnosis}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Next 7 days overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {visits.filter(v => isToday(new Date(v.visit_date))).length}
              </div>
              <p className="text-sm text-muted-foreground">Today</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {visits.filter(v => {
                  const date = new Date(v.visit_date);
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  return format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd');
                }).length}
              </div>
              <p className="text-sm text-muted-foreground">Tomorrow</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {visits.filter(v => {
                  const date = new Date(v.visit_date);
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  return isFuture(date) && date <= nextWeek;
                }).length}
              </div>
              <p className="text-sm text-muted-foreground">Next 7 Days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};