import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Loader2, PlusCircle, Utensils, Calendar } from 'lucide-react';

interface NutritionLogEntry {
  id: string;
  food_consumed: any;
  meal_type: string;
  date_consumed: string;
  calories_consumed?: number;
  notes?: string;
}

interface LogForm {
  food_items: string;
  meal_type: string;
  date_consumed: string;
  calories_consumed?: number;
  notes?: string;
}

const NutritionLog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<NutritionLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  
  const form = useForm<LogForm>({
    defaultValues: {
      date_consumed: new Date().toISOString().split('T')[0],
      meal_type: 'lunch'
    }
  });

  useEffect(() => {
    if (user) {
      fetchPatientProfile();
    }
  }, [user]);

  useEffect(() => {
    if (patientId) {
      fetchNutritionLogs();
    }
  }, [patientId]);

  const fetchPatientProfile = async () => {
    try {
      const { data: patient, error } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching patient profile:', error);
        return;
      }

      setPatientId(patient.id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchNutritionLogs = async () => {
    if (!patientId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('patient_id', patientId)
        .order('date_consumed', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching nutrition logs:', error);
        toast({
          title: "Error",
          description: "Failed to load nutrition logs",
          variant: "destructive",
        });
        return;
      }

      setLogs(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: LogForm) => {
    if (!patientId) {
      toast({
        title: "Error",
        description: "Patient profile not found",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Parse food items (simple text to array conversion)
      const foodItems = data.food_items
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .map(item => ({ name: item, estimated_calories: null }));

      const { error } = await supabase
        .from('nutrition_logs')
        .insert({
          patient_id: patientId,
          food_consumed: foodItems,
          meal_type: data.meal_type,
          date_consumed: data.date_consumed,
          calories_consumed: data.calories_consumed || null,
          notes: data.notes || null
        });

      if (error) {
        console.error('Error saving nutrition log:', error);
        toast({
          title: "Error",
          description: "Failed to save nutrition log",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Nutrition log saved successfully",
      });

      // Reset form and refresh logs
      form.reset({
        food_items: '',
        meal_type: 'lunch',
        date_consumed: new Date().toISOString().split('T')[0],
        calories_consumed: undefined,
        notes: ''
      });
      
      fetchNutritionLogs();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to save nutrition log",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const mealTypeEmojis = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎'
  };

  return (
    <div className="space-y-6">
      {/* Log New Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Log Your Meals
          </CardTitle>
          <CardDescription>
            Track what you've eaten to help improve future recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meal_type">Meal Type</Label>
                <Select
                  value={form.watch('meal_type')}
                  onValueChange={(value) => form.setValue('meal_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                    <SelectItem value="lunch">☀️ Lunch</SelectItem>
                    <SelectItem value="dinner">🌙 Dinner</SelectItem>
                    <SelectItem value="snack">🍎 Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_consumed">Date</Label>
                <Input
                  id="date_consumed"
                  type="date"
                  {...form.register('date_consumed', { required: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="food_items">Foods Consumed</Label>
              <Textarea
                id="food_items"
                placeholder="List the foods you ate, separated by commas (e.g., grilled chicken, brown rice, steamed broccoli)"
                {...form.register('food_items', { required: true })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories_consumed">Estimated Calories (optional)</Label>
                <Input
                  id="calories_consumed"
                  type="number"
                  placeholder="Total calories for this meal"
                  {...form.register('calories_consumed', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="How did you feel after eating? Any reactions or thoughts..."
                {...form.register('notes')}
              />
            </div>

            <Button 
              type="submit" 
              disabled={submitting || !patientId}
              className="w-full"
              variant="medical"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Log Meal
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Nutrition Logs
        </h3>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Utensils className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No nutrition logs yet. Start tracking your meals above!
              </p>
            </CardContent>
          </Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span>{mealTypeEmojis[log.meal_type as keyof typeof mealTypeEmojis]}</span>
                      {log.meal_type.charAt(0).toUpperCase() + log.meal_type.slice(1)}
                    </CardTitle>
                    <CardDescription>
                      {new Date(log.date_consumed).toLocaleDateString()}
                      {log.calories_consumed && (
                        <span className="ml-2">• {log.calories_consumed} calories</span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Foods Consumed:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(log.food_consumed) ? (
                      log.food_consumed.map((food: any, index: number) => (
                        <span 
                          key={index}
                          className="inline-block bg-accent px-2 py-1 rounded-md text-sm"
                        >
                          {typeof food === 'string' ? food : food.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No food data available</span>
                    )}
                  </div>
                </div>

                {log.notes && (
                  <div>
                    <h4 className="font-medium mb-1">Notes:</h4>
                    <p className="text-sm text-muted-foreground">{log.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NutritionLog;