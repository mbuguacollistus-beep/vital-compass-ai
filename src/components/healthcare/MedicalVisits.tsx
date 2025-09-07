import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, User, Plus, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface MedicalVisit {
  id: string;
  date: string;
  time: string;
  provider_name: string;
  specialty: string;
  location: string;
  visit_type: string;
  reason: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export const MedicalVisits = () => {
  const [visits, setVisits] = useState<MedicalVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<MedicalVisit | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    provider_name: '',
    specialty: '',
    location: '',
    visit_type: 'routine',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      // For now, use mock data since we don't have the proper database table
      const mockVisits: MedicalVisit[] = [
        {
          id: '1',
          date: '2024-01-20',
          time: '14:00',
          provider_name: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          location: 'City Medical Center',
          visit_type: 'follow_up',
          reason: 'Blood pressure follow-up',
          status: 'completed',
          notes: 'Blood pressure improved, continue current medication.'
        }
      ];
      setVisits(mockVisits);
    } catch (error) {
      console.error('Error fetching visits:', error);
      toast({
        title: "Error",
        description: "Failed to load medical visits.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, just add to local state since we don't have the proper database table
      const newVisit: MedicalVisit = {
        id: Date.now().toString(),
        ...formData,
        status: 'scheduled'
      };

      if (editingVisit) {
        setVisits(prev => prev.map(visit => 
          visit.id === editingVisit.id ? { ...editingVisit, ...formData, status: editingVisit.status } : visit
        ));
      } else {
        setVisits(prev => [...prev, newVisit]);
      }

      toast({
        title: "Success",
        description: `Medical visit ${editingVisit ? 'updated' : 'added'} successfully.`,
      });

      setIsDialogOpen(false);
      resetForm();
      fetchVisits();
    } catch (error) {
      console.error('Error saving visit:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingVisit ? 'update' : 'add'} visit.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      provider_name: '',
      specialty: '',
      location: '',
      visit_type: 'routine',
      reason: '',
      notes: ''
    });
    setEditingVisit(null);
  };

  const handleEdit = (visit: MedicalVisit) => {
    setFormData({
      date: visit.date,
      time: visit.time,
      provider_name: visit.provider_name,
      specialty: visit.specialty,
      location: visit.location,
      visit_type: visit.visit_type,
      reason: visit.reason,
      notes: visit.notes || ''
    });
    setEditingVisit(visit);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'default',
      completed: 'secondary', 
      cancelled: 'destructive'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  if (loading && visits.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Medical Visits</h2>
          <p className="text-muted-foreground">Track your healthcare appointments and visits</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Visit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingVisit ? 'Edit' : 'Add'} Medical Visit</DialogTitle>
              <DialogDescription>
                {editingVisit ? 'Update' : 'Record'} details of your medical appointment.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="provider_name">Provider Name</Label>
                    <Input
                      id="provider_name"
                      value={formData.provider_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, provider_name: e.target.value }))}
                      placeholder="Dr. Jane Smith"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialty">Specialty</Label>
                    <Select value={formData.specialty} onValueChange={(value) => setFormData(prev => ({ ...prev, specialty: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
                        <SelectItem value="endocrinology">Endocrinology</SelectItem>
                        <SelectItem value="family_medicine">Family Medicine</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="psychiatry">Psychiatry</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Medical Center Name or Address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="visit_type">Visit Type</Label>
                  <Select value={formData.visit_type} onValueChange={(value) => setFormData(prev => ({ ...prev, visit_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine Check-up</SelectItem>
                      <SelectItem value="follow_up">Follow-up</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Annual physical, follow-up on blood pressure, etc."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about the visit..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingVisit ? 'Update' : 'Add')} Visit
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {visits.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Medical Visits Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your healthcare appointments and visits.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              Add Your First Visit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {visits.map((visit) => (
            <Card key={visit.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <h3 className="font-semibold text-lg">{visit.provider_name}</h3>
                      {getStatusBadge(visit.status)}
                    </div>
                    <p className="text-muted-foreground capitalize">{visit.specialty}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(visit)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(visit.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{visit.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{visit.location}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Reason:</p>
                  <p className="text-sm">{visit.reason}</p>
                  {visit.notes && (
                    <>
                      <p className="text-sm text-muted-foreground mb-1 mt-2">Notes:</p>
                      <p className="text-sm">{visit.notes}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};