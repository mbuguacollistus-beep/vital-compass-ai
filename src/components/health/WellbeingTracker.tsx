import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, TrendingUp, Heart } from "lucide-react";

interface WellbeingEntry {
  id: string;
  score: number;
  symptoms: string;
  notes: string;
  date_recorded: string;
  created_at: string;
}

export const WellbeingTracker = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<WellbeingEntry[]>([]);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    score: [7],
    symptoms: "",
    notes: "",
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  useEffect(() => {
    if (patientId) {
      fetchWellbeingEntries();
    }
  }, [patientId]);

  const fetchPatientProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: patient } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (patient) {
          setPatientId(patient.id);
        }
      }
    } catch (error) {
      console.error('Error fetching patient profile:', error);
    }
  };

  const fetchWellbeingEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('wellbeing_entries')
        .select('*')
        .eq('patient_id', patientId)
        .order('date_recorded', { ascending: false })
        .limit(10);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching wellbeing entries:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('wellbeing_entries')
        .insert({
          patient_id: patientId,
          score: formData.score[0],
          symptoms: formData.symptoms,
          notes: formData.notes,
          date_recorded: formData.date,
        });

      if (error) throw error;

      toast({
        title: "Well-being entry saved!",
        description: "Your daily well-being has been recorded successfully.",
      });

      setFormData({
        score: [7],
        symptoms: "",
        notes: "",
        date: new Date().toISOString().split('T')[0],
      });

      fetchWellbeingEntries();
    } catch (error) {
      console.error('Error saving wellbeing entry:', error);
      toast({
        title: "Error",
        description: "Failed to save well-being entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 5) return "Fair";
    if (score >= 3) return "Poor";
    return "Very Poor";
  };

  return (
    <div className="space-y-6">
      {/* Today's Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Daily Well-being Check
          </CardTitle>
          <CardDescription>
            Track your daily well-being score and symptoms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label>Well-being Score: {formData.score[0]}/10 ({getScoreLabel(formData.score[0])})</Label>
              <div className="mt-2">
                <Slider
                  value={formData.score}
                  onValueChange={(value) => setFormData(prev => ({...prev, score: value}))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Very Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="symptoms">Symptoms (if any)</Label>
              <Input
                id="symptoms"
                placeholder="e.g., headache, fatigue, nausea"
                value={formData.symptoms}
                onChange={(e) => setFormData(prev => ({...prev, symptoms: e.target.value}))}
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="How are you feeling today? Any specific concerns?"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                rows={3}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Well-being Entry"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Well-being History
          </CardTitle>
          <CardDescription>
            Your well-being entries from the past days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No well-being entries yet. Start tracking your daily well-being above.
            </p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {new Date(entry.date_recorded).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={`font-bold ${getScoreColor(entry.score)}`}>
                      {entry.score}/10 ({getScoreLabel(entry.score)})
                    </div>
                  </div>
                  
                  {entry.symptoms && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Symptoms: </span>
                      <span className="text-sm">{entry.symptoms}</span>
                    </div>
                  )}
                  
                  {entry.notes && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Notes: </span>
                      <span className="text-sm">{entry.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};