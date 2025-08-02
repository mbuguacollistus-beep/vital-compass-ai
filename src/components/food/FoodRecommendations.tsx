import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, Star, ChefHat, Apple, Utensils } from 'lucide-react';

interface FoodRecommendation {
  id: string;
  recommendation_type: string;
  recommended_foods: any; // JSON data from Supabase
  reasoning: string;
  dietary_goals: string[];
  meal_type: string;
  date_recommended: string;
  is_favorite: boolean;
  patient_rating?: number;
}

const FoodRecommendations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingNew, setGeneratingNew] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('lunch');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [patientId, setPatientId] = useState<string | null>(null);

  const dietaryGoalOptions = [
    'weight_management',
    'diabetes_control', 
    'heart_health',
    'digestive_health',
    'energy_boost',
    'immune_support',
    'bone_health',
    'brain_health'
  ];

  const mealTypeIcons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎'
  };

  useEffect(() => {
    if (user) {
      fetchPatientProfile();
      fetchRecommendations();
    }
  }, [user]);

  const fetchPatientProfile = async () => {
    try {
      const { data: patient, error } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching patient profile:', error);
        return;
      }

      setPatientId(patient.id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchRecommendations = async () => {
    if (!patientId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('food_recommendations')
        .select('*')
        .eq('patient_id', patientId)
        .order('date_recommended', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recommendations:', error);
        toast({
          title: "Error",
          description: "Failed to load food recommendations",
          variant: "destructive",
        });
        return;
      }

      setRecommendations(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendation = async () => {
    if (!patientId) {
      toast({
        title: "Error",
        description: "Patient profile not found. Please complete your profile first.",
        variant: "destructive",
      });
      return;
    }

    setGeneratingNew(true);
    try {
      const response = await supabase.functions.invoke('food-recommendations', {
        body: {
          patient_id: patientId,
          meal_type: selectedMealType,
          dietary_goals: selectedGoals,
          recommendation_type: 'daily_meal'
        }
      });

      if (response.error) {
        console.error('Error generating recommendation:', response.error);
        toast({
          title: "Error",
          description: "Failed to generate food recommendation",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: "New food recommendation generated",
      });

      // Refresh recommendations
      fetchRecommendations();
      
      // Reset form
      setSelectedGoals([]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendation",
        variant: "destructive",
      });
    } finally {
      setGeneratingNew(false);
    }
  };

  const toggleFavorite = async (recommendationId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('food_recommendations')
        .update({ is_favorite: !currentFavorite })
        .eq('id', recommendationId);

      if (error) {
        console.error('Error updating favorite:', error);
        return;
      }

      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId 
            ? { ...rec, is_favorite: !currentFavorite }
            : rec
        )
      );

      toast({
        title: currentFavorite ? "Removed from favorites" : "Added to favorites",
        description: "Recommendation updated successfully",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const rateRecommendation = async (recommendationId: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('food_recommendations')
        .update({ patient_rating: rating })
        .eq('id', recommendationId);

      if (error) {
        console.error('Error rating recommendation:', error);
        return;
      }

      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId 
            ? { ...rec, patient_rating: rating }
            : rec
        )
      );

      toast({
        title: "Rating saved",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  return (
    <div className="space-y-6">
      {/* Generate New Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            Generate Personalized Food Recommendation
          </CardTitle>
          <CardDescription>
            Get AI-powered food suggestions based on your health profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Meal Type</label>
              <Select value={selectedMealType} onValueChange={setSelectedMealType}>
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dietary Goals (optional)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {dietaryGoalOptions.map(goal => (
                <label key={goal} className="flex items-center space-x-2 text-sm">
                  <Checkbox
                    checked={selectedGoals.includes(goal)}
                    onCheckedChange={() => handleGoalToggle(goal)}
                  />
                  <span className="capitalize">{goal.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <Button 
            onClick={generateRecommendation} 
            disabled={generatingNew || !patientId}
            className="w-full"
            variant="medical"
          >
            {generatingNew ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Recommendation...
              </>
            ) : (
              <>
                <Apple className="w-4 h-4 mr-2" />
                Generate Food Recommendation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Utensils className="w-5 h-5" />
          Your Food Recommendations
        </h3>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading recommendations...</span>
          </div>
        ) : recommendations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Apple className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No food recommendations yet. Generate your first personalized meal suggestion above!
              </p>
            </CardContent>
          </Card>
        ) : (
          recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span>{mealTypeIcons[recommendation.meal_type as keyof typeof mealTypeIcons]}</span>
                      {recommendation.meal_type.charAt(0).toUpperCase() + recommendation.meal_type.slice(1)} Recommendation
                      {recommendation.is_favorite && (
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      {new Date(recommendation.date_recommended).toLocaleDateString()}
                      {recommendation.dietary_goals.length > 0 && (
                        <span className="ml-2">
                          • Goals: {recommendation.dietary_goals.join(', ')}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(recommendation.id, recommendation.is_favorite)}
                  >
                    <Heart className={`w-4 h-4 ${recommendation.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Recommended Foods:</h4>
                  <div className="grid gap-3">
                    {(Array.isArray(recommendation.recommended_foods) ? recommendation.recommended_foods : []).map((food: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{food.food_name || food.name || 'Unknown food'}</div>
                          <div className="text-sm text-muted-foreground">{food.portion_size || food.portion || 'Serving size not specified'}</div>
                          <div className="text-sm mt-1">{food.benefits || food.benefit || 'Health benefits'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Why These Foods?</h4>
                  <p className="text-sm text-muted-foreground">{recommendation.reasoning}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <span className="text-sm">Rate this recommendation:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        variant="ghost"
                        size="sm"
                        onClick={() => rateRecommendation(recommendation.id, rating)}
                        className="p-1"
                      >
                        <Star 
                          className={`w-4 h-4 ${
                            (recommendation.patient_rating || 0) >= rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodRecommendations;