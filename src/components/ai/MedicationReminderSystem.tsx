import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Clock, Plus, Check, AlertCircle, Calendar, Pill } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  reminderEnabled: boolean;
  nextDue: Date;
  lastTaken?: Date;
  instructions?: string;
}

interface Appointment {
  id: string;
  title: string;
  date: Date;
  provider: string;
  type: string;
  reminderEnabled: boolean;
}

export const MedicationReminderSystem = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      times: ['08:00'],
      reminderEnabled: true,
      nextDue: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      instructions: 'Take with food'
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      times: ['08:00', '20:00'],
      reminderEnabled: true,
      nextDue: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      instructions: 'Take with meals'
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Cardiology Follow-up',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      provider: 'Dr. Smith',
      type: 'Follow-up',
      reminderEnabled: true
    },
    {
      id: '2',
      title: 'Annual Physical',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      provider: 'Dr. Johnson',
      type: 'Routine',
      reminderEnabled: true
    }
  ]);

  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    times: ['08:00']
  });

  const { toast } = useToast();

  useEffect(() => {
    // Check for due medications every minute
    const interval = setInterval(() => {
      checkDueReminders();
    }, 60000);

    return () => clearInterval(interval);
  }, [medications, appointments]);

  const checkDueReminders = () => {
    const now = new Date();
    
    medications.forEach(med => {
      if (med.reminderEnabled && med.nextDue <= now) {
        showMedicationReminder(med);
        // Update next due time
        updateNextDueTime(med.id);
      }
    });

    appointments.forEach(apt => {
      const reminderTime = new Date(apt.date.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
      if (apt.reminderEnabled && reminderTime <= now && reminderTime > new Date(now.getTime() - 60000)) {
        showAppointmentReminder(apt);
      }
    });
  };

  const showMedicationReminder = (medication: Medication) => {
    toast({
      title: "💊 Medication Reminder",
      description: `Time to take ${medication.name} ${medication.dosage}${medication.instructions ? ` - ${medication.instructions}` : ''}`,
      duration: 10000,
    });
  };

  const showAppointmentReminder = (appointment: Appointment) => {
    toast({
      title: "📅 Appointment Reminder",
      description: `${appointment.title} with ${appointment.provider} is tomorrow at ${appointment.date.toLocaleTimeString()}`,
      duration: 10000,
    });
  };

  const markAsTaken = (medicationId: string) => {
    setMedications(prev => prev.map(med => 
      med.id === medicationId 
        ? { ...med, lastTaken: new Date() }
        : med
    ));
    
    toast({
      title: "Medication Taken",
      description: "Successfully logged medication intake",
    });
    
    updateNextDueTime(medicationId);
  };

  const updateNextDueTime = (medicationId: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medicationId) {
        const nextDue = new Date();
        if (med.frequency === 'Once daily') {
          nextDue.setDate(nextDue.getDate() + 1);
        } else if (med.frequency === 'Twice daily') {
          nextDue.setHours(nextDue.getHours() + 12);
        } else if (med.frequency === 'Three times daily') {
          nextDue.setHours(nextDue.getHours() + 8);
        }
        return { ...med, nextDue };
      }
      return med;
    }));
  };

  const addMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      toast({
        title: "Missing Information",
        description: "Please fill in medication name and dosage",
        variant: "destructive",
      });
      return;
    }

    const medication: Medication = {
      id: Date.now().toString(),
      ...newMedication,
      reminderEnabled: true,
      nextDue: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
    };

    setMedications(prev => [...prev, medication]);
    setNewMedication({ name: '', dosage: '', frequency: '', times: ['08:00'] });
    
    toast({
      title: "Medication Added",
      description: "New medication reminder has been set up",
    });
  };

  const toggleReminder = (medicationId: string, enabled: boolean) => {
    setMedications(prev => prev.map(med => 
      med.id === medicationId 
        ? { ...med, reminderEnabled: enabled }
        : med
    ));
  };

  const getTimeUntilNext = (nextDue: Date) => {
    const now = new Date();
    const diffMs = nextDue.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Due now';
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Current Medications */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Medication Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {medications.map(medication => (
            <div key={medication.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  medication.nextDue <= new Date() ? 'bg-warning animate-pulse' : 'bg-accent'
                }`}></div>
                <div>
                  <h4 className="font-medium">{medication.name} {medication.dosage}</h4>
                  <p className="text-sm text-muted-foreground">{medication.frequency}</p>
                  {medication.instructions && (
                    <p className="text-xs text-muted-foreground italic">{medication.instructions}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">Next: {getTimeUntilNext(medication.nextDue)}</p>
                  {medication.lastTaken && (
                    <p className="text-xs text-muted-foreground">
                      Last taken: {medication.lastTaken.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                
                <Button
                  size="sm"
                  onClick={() => markAsTaken(medication.id)}
                  disabled={medication.lastTaken && 
                    new Date().getTime() - medication.lastTaken.getTime() < 3600000} // 1 hour cooldown
                >
                  <Check className="h-4 w-4 mr-1" />
                  Take
                </Button>
                
                <Switch
                  checked={medication.reminderEnabled}
                  onCheckedChange={(enabled) => toggleReminder(medication.id, enabled)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add New Medication */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add New Medication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Medication name"
              value={newMedication.name}
              onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Dosage (e.g., 10mg)"
              value={newMedication.dosage}
              onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
            />
            <Select
              value={newMedication.frequency}
              onValueChange={(value) => setNewMedication(prev => ({ ...prev, frequency: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Once daily">Once daily</SelectItem>
                <SelectItem value="Twice daily">Twice daily</SelectItem>
                <SelectItem value="Three times daily">Three times daily</SelectItem>
                <SelectItem value="Four times daily">Four times daily</SelectItem>
                <SelectItem value="As needed">As needed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addMedication}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments.map(appointment => (
            <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Clock className="h-4 w-4 text-accent" />
                <div>
                  <h4 className="font-medium">{appointment.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {appointment.provider} • {appointment.date.toLocaleDateString()} at {appointment.date.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline">{appointment.type}</Badge>
                <Switch
                  checked={appointment.reminderEnabled}
                  onCheckedChange={(enabled) => {
                    setAppointments(prev => prev.map(apt => 
                      apt.id === appointment.id 
                        ? { ...apt, reminderEnabled: enabled }
                        : apt
                    ));
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-muted/50 border-accent/20">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <Bell className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
            Reminders are personalized based on your schedule and medication regimen. Always follow your healthcare provider's instructions and never adjust medications without consulting them.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};