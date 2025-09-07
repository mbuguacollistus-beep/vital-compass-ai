import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Users, Phone, Mail, Plus, Edit, Heart, Stethoscope, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface CareContact {
  id: string;
  name: string;
  relationship: string;
  contact_type: 'family' | 'healthcare_provider' | 'caregiver';
  phone?: string;
  email?: string;
  specialty?: string;
  organization?: string;
  notes?: string;
}

export const CareNetwork = () => {
  const [contacts, setContacts] = useState<CareContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<CareContact | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState<{
    name: string;
    relationship: string;
    contact_type: 'family' | 'healthcare_provider' | 'caregiver';
    phone: string;
    email: string;
    specialty: string;
    organization: string;
    notes: string;
  }>({
    name: '',
    relationship: '',
    contact_type: 'family',
    phone: '',
    email: '',
    specialty: '',
    organization: '',
    notes: ''
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      // For now, use mock data since we don't have the proper database table
      const mockContacts: CareContact[] = [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          relationship: 'Primary Care Doctor',
          contact_type: 'healthcare_provider',
          phone: '(555) 123-4567',
          email: 'sarah.johnson@healthcare.com',
          specialty: 'Family Medicine',
          organization: 'City Medical Center'
        }
      ];
      setContacts(mockContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load care network contacts.",
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
      const newContact: CareContact = {
        id: Date.now().toString(),
        ...formData
      };

      if (editingContact) {
        setContacts(prev => prev.map(contact => 
          contact.id === editingContact.id ? { ...editingContact, ...formData } : contact
        ));
      } else {
        setContacts(prev => [...prev, newContact]);
      }

      toast({
        title: "Success",
        description: `Contact ${editingContact ? 'updated' : 'added'} successfully.`,
      });

      setIsDialogOpen(false);
      resetForm();
      fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingContact ? 'update' : 'add'} contact.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      contact_type: 'family',
      phone: '',
      email: '',
      specialty: '',
      organization: '',
      notes: ''
    });
    setEditingContact(null);
  };

  const handleEdit = (contact: CareContact) => {
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      contact_type: contact.contact_type,
      phone: contact.phone || '',
      email: contact.email || '',
      specialty: contact.specialty || '',
      organization: contact.organization || '',
      notes: contact.notes || ''
    });
    setEditingContact(contact);
    setIsDialogOpen(true);
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'healthcare_provider':
        return <Stethoscope className="w-5 h-5" />;
      case 'caregiver':
        return <UserPlus className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const getContactBadgeColor = (type: string) => {
    switch (type) {
      case 'healthcare_provider':
        return 'default';
      case 'caregiver':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const groupedContacts = contacts.reduce((groups, contact) => {
    const group = groups[contact.contact_type] || [];
    groups[contact.contact_type] = [...group, contact];
    return groups;
  }, {} as Record<string, CareContact[]>);

  if (loading && contacts.length === 0) {
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
          <h2 className="text-2xl font-bold">Care Network</h2>
          <p className="text-muted-foreground">Manage your healthcare team and support network</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingContact ? 'Edit' : 'Add'} Care Contact</DialogTitle>
              <DialogDescription>
                {editingContact ? 'Update' : 'Add'} someone to your care network.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_type">Type</Label>
                    <Select value={formData.contact_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, contact_type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">Family Member</SelectItem>
                        <SelectItem value="healthcare_provider">Healthcare Provider</SelectItem>
                        <SelectItem value="caregiver">Caregiver</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={formData.relationship}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                    placeholder="e.g., Spouse, Doctor, Nurse, etc."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                {formData.contact_type === 'healthcare_provider' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        value={formData.specialty}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                        placeholder="e.g., Cardiology, Family Medicine"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                        placeholder="Hospital or Clinic name"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional information..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingContact ? 'Update' : 'Add')} Contact
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Care Network Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add family members, healthcare providers, and caregivers to your network.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              Add Your First Contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedContacts).map(([type, typeContacts]) => (
            <Card key={type}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getContactIcon(type)}
                  <span className="capitalize">
                    {type === 'healthcare_provider' ? 'Healthcare Providers' : 
                     type === 'caregiver' ? 'Caregivers' : 'Family Members'}
                  </span>
                  <Badge variant="secondary">{typeContacts.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {typeContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="font-semibold">{contact.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getContactBadgeColor(contact.contact_type)}>
                            {contact.relationship}
                          </Badge>
                          {contact.specialty && (
                            <Badge variant="outline">{contact.specialty}</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {contact.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                        </div>
                        {contact.organization && (
                          <p className="text-sm text-muted-foreground">{contact.organization}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(contact)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};