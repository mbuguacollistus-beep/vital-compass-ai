import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Heart, Activity, Brain, Utensils, Moon, TrendingUp, Calendar, Share } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface JournalEntry {
  id: string;
  date: Date;
  mood: number;
  energy: number;
  pain: number;
  sleep: {
    hours: number;
    quality: number;
  };
  exercise: {
    type: string;
    duration: number;
    intensity: string;
  } | null;
  nutrition: {
    meals: string[];
    water: number;
    notes: string;
  };
  symptoms: string[];
  notes: string;
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    weight: number;
  };
}

export const HealthJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      mood: 7,
      energy: 6,
      pain: 3,
      sleep: { hours: 7.5, quality: 8 },
      exercise: { type: 'Walking', duration: 30, intensity: 'Moderate' },
      nutrition: { 
        meals: ['Oatmeal with berries', 'Grilled chicken salad', 'Salmon with vegetables'],
        water: 8,
        notes: 'Felt satisfied with meals'
      },
      symptoms: ['Mild headache'],
      notes: 'Good day overall, felt energetic in the morning'
    }
  ]);

  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    mood: 5,
    energy: 5,
    pain: 0,
    sleep: { hours: 8, quality: 5 },
    exercise: null,
    nutrition: { meals: [], water: 8, notes: '' },
    symptoms: [],
    notes: '',
    vitals: undefined
  });

  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const { toast } = useToast();

  const addEntry = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: newEntry.mood || 5,
      energy: newEntry.energy || 5,
      pain: newEntry.pain || 0,
      sleep: newEntry.sleep || { hours: 8, quality: 5 },
      exercise: newEntry.exercise || null,
      nutrition: newEntry.nutrition || { meals: [], water: 8, notes: '' },
      symptoms: newEntry.symptoms || [],
      notes: newEntry.notes || '',
      vitals: newEntry.vitals
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({
      mood: 5,
      energy: 5,
      pain: 0,
      sleep: { hours: 8, quality: 5 },
      exercise: null,
      nutrition: { meals: [], water: 8, notes: '' },
      symptoms: [],
      notes: '',
      vitals: undefined
    });

    toast({
      title: "Entry Added",
      description: "Your health journal entry has been saved",
    });
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-accent';
    if (mood >= 6) return 'text-primary';
    if (mood >= 4) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number, type: 'mood' | 'energy' | 'pain' | 'sleep') => {
    if (type === 'pain') {
      if (score === 0) return 'No pain';
      if (score <= 3) return 'Mild';
      if (score <= 6) return 'Moderate';
      return 'Severe';
    }
    
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  };

  const shareWithProvider = (entryId: string) => {
    toast({
      title: "Shared with Provider",
      description: "Journal entry has been shared with your healthcare team",
    });
  };

  return (
    <div className="space-y-6">
      {/* Add New Entry Form */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            New Journal Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood, Energy, Pain Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Mood: {newEntry.mood}/10
              </label>
              <Slider
                value={[newEntry.mood || 5]}
                onValueChange={(value) => setNewEntry(prev => ({ ...prev, mood: value[0] }))}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">{getScoreLabel(newEntry.mood || 5, 'mood')}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-accent" />
                Energy: {newEntry.energy}/10
              </label>
              <Slider
                value={[newEntry.energy || 5]}
                onValueChange={(value) => setNewEntry(prev => ({ ...prev, energy: value[0] }))}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">{getScoreLabel(newEntry.energy || 5, 'energy')}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-warning" />
                Pain Level: {newEntry.pain}/10
              </label>
              <Slider
                value={[newEntry.pain || 0]}
                onValueChange={(value) => setNewEntry(prev => ({ ...prev, pain: value[0] }))}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">{getScoreLabel(newEntry.pain || 0, 'pain')}</p>
            </div>
          </div>

          {/* Sleep Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Moon className="h-4 w-4 text-primary" />
                Sleep Hours
              </label>
              <Input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={newEntry.sleep?.hours || 8}
                onChange={(e) => setNewEntry(prev => ({
                  ...prev,
                  sleep: { ...prev.sleep!, hours: parseFloat(e.target.value) || 8 }
                }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Sleep Quality: {newEntry.sleep?.quality}/10
              </label>
              <Slider
                value={[newEntry.sleep?.quality || 5]}
                onValueChange={(value) => setNewEntry(prev => ({
                  ...prev,
                  sleep: { ...prev.sleep!, quality: value[0] }
                }))}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Exercise */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Exercise (optional)</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Exercise type"
                value={newEntry.exercise?.type || ''}
                onChange={(e) => setNewEntry(prev => ({
                  ...prev,
                  exercise: { 
                    type: e.target.value,
                    duration: prev.exercise?.duration || 30,
                    intensity: prev.exercise?.intensity || 'Moderate'
                  }
                }))}
              />
              <Input
                type="number"
                placeholder="Duration (minutes)"
                value={newEntry.exercise?.duration || ''}
                onChange={(e) => setNewEntry(prev => ({
                  ...prev,
                  exercise: { 
                    type: prev.exercise?.type || '',
                    duration: parseInt(e.target.value) || 30,
                    intensity: prev.exercise?.intensity || 'Moderate'
                  }
                }))}
              />
              <Select
                value={newEntry.exercise?.intensity || 'Moderate'}
                onValueChange={(value) => setNewEntry(prev => ({
                  ...prev,
                  exercise: { 
                    type: prev.exercise?.type || '',
                    duration: prev.exercise?.duration || 30,
                    intensity: value
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Light">Light</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Vigorous">Vigorous</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vitals */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Vitals (optional)</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVitalsForm(!showVitalsForm)}
              >
                {showVitalsForm ? 'Hide' : 'Add'} Vitals
              </Button>
            </div>
            {showVitalsForm && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Blood Pressure (e.g., 120/80)"
                  value={newEntry.vitals?.bloodPressure || ''}
                  onChange={(e) => setNewEntry(prev => ({
                    ...prev,
                    vitals: { 
                      ...prev.vitals!,
                      bloodPressure: e.target.value,
                      heartRate: prev.vitals?.heartRate || 70,
                      weight: prev.vitals?.weight || 0
                    }
                  }))}
                />
                <Input
                  type="number"
                  placeholder="Heart Rate (bpm)"
                  value={newEntry.vitals?.heartRate || ''}
                  onChange={(e) => setNewEntry(prev => ({
                    ...prev,
                    vitals: { 
                      ...prev.vitals!,
                      bloodPressure: prev.vitals?.bloodPressure || '',
                      heartRate: parseInt(e.target.value) || 70,
                      weight: prev.vitals?.weight || 0
                    }
                  }))}
                />
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Weight (lbs)"
                  value={newEntry.vitals?.weight || ''}
                  onChange={(e) => setNewEntry(prev => ({
                    ...prev,
                    vitals: { 
                      ...prev.vitals!,
                      bloodPressure: prev.vitals?.bloodPressure || '',
                      heartRate: prev.vitals?.heartRate || 70,
                      weight: parseFloat(e.target.value) || 0
                    }
                  }))}
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes & Observations</label>
            <Textarea
              placeholder="How are you feeling today? Any symptoms or observations to note?"
              value={newEntry.notes || ''}
              onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <Button onClick={addEntry} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Entries</h3>
        
        {entries.map(entry => (
          <Card key={entry.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {entry.date.toLocaleDateString()}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getMoodColor(entry.mood)}>
                    Mood: {entry.mood}/10
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => shareWithProvider(entry.id)}>
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Energy</p>
                  <p className="text-lg font-semibold text-accent">{entry.energy}/10</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Pain</p>
                  <p className="text-lg font-semibold text-warning">{entry.pain}/10</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Sleep</p>
                  <p className="text-lg font-semibold text-primary">{entry.sleep.hours}h</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Sleep Quality</p>
                  <p className="text-lg font-semibold text-primary">{entry.sleep.quality}/10</p>
                </div>
              </div>

              {entry.exercise && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  {entry.exercise.type} - {entry.exercise.duration} minutes ({entry.exercise.intensity})
                </div>
              )}

              {entry.vitals && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>BP: {entry.vitals.bloodPressure}</span>
                  <span>HR: {entry.vitals.heartRate} bpm</span>
                  <span>Weight: {entry.vitals.weight} lbs</span>
                </div>
              )}

              {entry.notes && (
                <p className="text-sm">{entry.notes}</p>
              )}

              {entry.symptoms.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {entry.symptoms.map((symptom, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};