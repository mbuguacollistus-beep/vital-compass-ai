import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PatientProfileSetupProps {
  onComplete: () => void;
  patientId: string;
}

const medicalConditions = [
  "Diabetes", "Hypertension", "Heart Disease", "High Cholesterol", 
  "Kidney Disease", "Liver Disease", "Arthritis", "Asthma", "Depression", "Anxiety"
];

const allergies = [
  "Nuts", "Dairy", "Eggs", "Fish", "Shellfish", "Soy", "Wheat", "Gluten"
];

export const PatientProfileSetup = ({ onComplete, patientId }: PatientProfileSetupProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    emergencyContactName: "",
    emergencyContactPhone: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    selectedConditions: [] as string[],
    selectedAllergies: [] as string[],
    currentMedications: "",
  });

  const handleConditionChange = (condition: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedConditions: checked 
        ? [...prev.selectedConditions, condition]
        : prev.selectedConditions.filter(c => c !== condition)
    }));
  };

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedAllergies: checked 
        ? [...prev.selectedAllergies, allergy]
        : prev.selectedAllergies.filter(a => a !== allergy)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const medications = formData.currentMedications
        .split(',')
        .map(med => med.trim())
        .filter(med => med.length > 0);

      const { error } = await supabase
        .from('patients')
        .update({
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_phone: formData.emergencyContactPhone,
          insurance_provider: formData.insuranceProvider,
          insurance_policy_number: formData.insurancePolicyNumber,
          medical_conditions: formData.selectedConditions,
          allergies: formData.selectedAllergies,
          current_medications: medications,
        })
        .eq('id', patientId);

      if (error) throw error;

      toast({
        title: "Profile setup complete!",
        description: "Your patient profile has been created successfully.",
      });

      onComplete();
    } catch (error) {
      console.error('Error updating patient profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Patient Profile</CardTitle>
        <CardDescription>
          Please provide your medical information to get personalized food recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
              <Input
                id="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData(prev => ({...prev, emergencyContactName: e.target.value}))}
                required
              />
            </div>
            <div>
              <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
              <Input
                id="emergencyContactPhone"
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData(prev => ({...prev, emergencyContactPhone: e.target.value}))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="insuranceProvider">Insurance Provider</Label>
              <Input
                id="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={(e) => setFormData(prev => ({...prev, insuranceProvider: e.target.value}))}
              />
            </div>
            <div>
              <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
              <Input
                id="insurancePolicyNumber"
                value={formData.insurancePolicyNumber}
                onChange={(e) => setFormData(prev => ({...prev, insurancePolicyNumber: e.target.value}))}
              />
            </div>
          </div>

          <div>
            <Label>Medical Conditions (select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {medicalConditions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={formData.selectedConditions.includes(condition)}
                    onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                  />
                  <Label htmlFor={condition} className="text-sm">{condition}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Allergies (select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {allergies.map((allergy) => (
                <div key={allergy} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergy}
                    checked={formData.selectedAllergies.includes(allergy)}
                    onCheckedChange={(checked) => handleAllergyChange(allergy, checked as boolean)}
                  />
                  <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="currentMedications">Current Medications</Label>
            <Textarea
              id="currentMedications"
              placeholder="Enter medications separated by commas (e.g., Metformin, Lisinopril, Aspirin)"
              value={formData.currentMedications}
              onChange={(e) => setFormData(prev => ({...prev, currentMedications: e.target.value}))}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Setting up profile..." : "Complete Setup"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};