import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Target, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";

interface HealthGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  target_date: string;
  created_date: string;
  completed: boolean;
}

export const HealthGoals = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    target_value: "",
    current_value: "",
    unit: "",
    target_date: "",
  });

  useEffect(() => {
    // Load goals from localStorage (in a real app, this would be from Supabase)
    const savedGoals = localStorage.getItem('health_goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const saveGoals = (updatedGoals: HealthGoal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('health_goals', JSON.stringify(updatedGoals));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: HealthGoal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      target_value: parseFloat(formData.target_value),
      current_value: parseFloat(formData.current_value) || 0,
      unit: formData.unit,
      target_date: formData.target_date,
      created_date: new Date().toISOString().split('T')[0],
      completed: false,
    };

    const updatedGoals = [...goals, newGoal];
    saveGoals(updatedGoals);

    setFormData({
      title: "",
      description: "",
      category: "",
      target_value: "",
      current_value: "",
      unit: "",
      target_date: "",
    });
    setShowAddForm(false);

    toast({
      title: "Goal added!",
      description: "Your health goal has been created successfully.",
    });
  };

  const updateProgress = (goalId: string, newValue: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const completed = newValue >= goal.target_value;
        return { ...goal, current_value: newValue, completed };
      }
      return goal;
    });
    
    saveGoals(updatedGoals);

    const goal = goals.find(g => g.id === goalId);
    if (goal && newValue >= goal.target_value && !goal.completed) {
      toast({
        title: "Goal completed! 🎉",
        description: `Congratulations on achieving your goal: ${goal.title}`,
      });
    }
  };

  const getProgressPercentage = (goal: HealthGoal) => {
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (goal: HealthGoal) => {
    if (goal.completed) return "text-success";
    const daysRemaining = getDaysRemaining(goal.target_date);
    if (daysRemaining < 0) return "text-destructive";
    if (daysRemaining < 7) return "text-warning";
    return "text-primary";
  };

  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Health Goals
          </CardTitle>
          <CardDescription>
            Set and track your health and wellness goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{activeGoals.length}</div>
                <div className="text-sm text-muted-foreground">Active Goals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{completedGoals.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              Add New Goal
            </Button>
          </div>

          {/* Add Goal Form */}
          {showAddForm && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                      placeholder="e.g., Lose weight, Exercise more"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                      placeholder="Describe your goal in detail"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weight">Weight Management</SelectItem>
                          <SelectItem value="exercise">Exercise & Fitness</SelectItem>
                          <SelectItem value="nutrition">Nutrition</SelectItem>
                          <SelectItem value="mental_health">Mental Health</SelectItem>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="target_date">Target Date</Label>
                      <Input
                        type="date"
                        id="target_date"
                        value={formData.target_date}
                        onChange={(e) => setFormData(prev => ({...prev, target_date: e.target.value}))}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="target_value">Target Value</Label>
                      <Input
                        type="number"
                        id="target_value"
                        value={formData.target_value}
                        onChange={(e) => setFormData(prev => ({...prev, target_value: e.target.value}))}
                        placeholder="e.g., 150"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="current_value">Current Value</Label>
                      <Input
                        type="number"
                        id="current_value"
                        value={formData.current_value}
                        onChange={(e) => setFormData(prev => ({...prev, current_value: e.target.value}))}
                        placeholder="e.g., 170"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Input
                        id="unit"
                        value={formData.unit}
                        onChange={(e) => setFormData(prev => ({...prev, unit: e.target.value}))}
                        placeholder="e.g., lbs, minutes, times"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">Add Goal</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Active Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeGoals.map((goal) => {
                const progress = getProgressPercentage(goal);
                const daysRemaining = getDaysRemaining(goal.target_date);
                
                return (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="capitalize">{goal.category.replace('_', ' ')}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {daysRemaining > 0 ? `${daysRemaining} days left` : 
                             daysRemaining === 0 ? 'Due today' : 
                             `${Math.abs(daysRemaining)} days overdue`}
                          </span>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${getStatusColor(goal)}`}>
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {goal.current_value} / {goal.target_value} {goal.unit}
                        </span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Update"
                            className="w-20 h-8"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (!isNaN(newValue)) {
                                  updateProgress(goal.id, newValue);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              const input = document.querySelector(`input[placeholder="Update"]`) as HTMLInputElement;
                              const newValue = parseFloat(input?.value || '0');
                              if (!isNaN(newValue)) {
                                updateProgress(goal.id, newValue);
                                if (input) input.value = '';
                              }
                            }}
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <CheckCircle2 className="w-5 h-5 text-success" />
               Completed Goals
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedGoals.map((goal) => (
                 <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg bg-success/10">
                   <div>
                     <h3 className="font-medium text-success">{goal.title}</h3>
                     <p className="text-sm text-success">
                       {goal.current_value} {goal.unit} achieved!
                     </p>
                   </div>
                   <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {goals.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No health goals yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your health journey by setting your first goal
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};