import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Search, Heart, Brain, Activity, Pill, Stethoscope, Eye, Play, Clock, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface EducationalContent {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  rating: number;
  tags: string[];
  lastUpdated: Date;
}

export const EducationHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  const { toast } = useToast();

  const educationalContent: EducationalContent[] = [
    {
      id: '1',
      title: 'Understanding High Blood Pressure',
      category: 'cardiovascular',
      description: 'Learn about hypertension, its causes, symptoms, and management strategies.',
      content: `
High blood pressure, also known as hypertension, is a common condition where the blood vessels have persistently raised pressure. Blood pressure is created by the force of blood pushing against the walls of blood vessels (arteries) as it is pumped by the heart.

**What causes high blood pressure?**
- Family history
- Age (risk increases with age)
- Excessive salt intake
- Lack of physical activity
- Obesity
- Excessive alcohol consumption
- Smoking
- Stress

**Symptoms:**
Most people with high blood pressure have no symptoms, which is why it's called the "silent killer." However, some may experience:
- Headaches
- Dizziness
- Shortness of breath
- Nosebleeds (rare)

**Management:**
- Take medications as prescribed
- Maintain a healthy weight
- Exercise regularly
- Limit sodium intake
- Monitor blood pressure at home
- Manage stress
- Limit alcohol and quit smoking

**When to seek immediate care:**
- Blood pressure readings consistently above 180/120
- Severe headache with high blood pressure
- Chest pain or difficulty breathing
- Visual changes or confusion
      `,
      difficulty: 'beginner',
      readTime: 5,
      rating: 4.8,
      tags: ['hypertension', 'heart health', 'prevention'],
      lastUpdated: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Managing Diabetes: A Comprehensive Guide',
      category: 'endocrine',
      description: 'Complete guide to understanding and managing diabetes effectively.',
      content: `
Diabetes is a chronic condition that occurs when your body cannot effectively use the insulin it produces or doesn't produce enough insulin. Insulin is a hormone that regulates blood sugar.

**Types of Diabetes:**
- Type 1: Body doesn't produce insulin
- Type 2: Body doesn't use insulin properly
- Gestational: Develops during pregnancy

**Blood Sugar Management:**
- Target blood glucose: 80-130 mg/dL before meals
- Target A1C: Less than 7% for most adults
- Monitor blood sugar regularly
- Take medications as prescribed

**Diet and Nutrition:**
- Count carbohydrates
- Choose complex carbohydrates
- Include lean proteins
- Eat regular meals
- Stay hydrated
- Limit sugary drinks and processed foods

**Exercise Guidelines:**
- Aim for 150 minutes of moderate activity per week
- Include both aerobic and resistance training
- Check blood sugar before and after exercise
- Carry glucose tablets during exercise
- Stay hydrated

**Complications to Watch For:**
- Heart disease
- Kidney damage
- Eye problems
- Nerve damage
- Foot problems
- Skin conditions

**Emergency Signs:**
- Very high blood sugar (over 250 mg/dL)
- Very low blood sugar (under 70 mg/dL)
- Ketones in urine
- Persistent vomiting
- Difficulty breathing
      `,
      difficulty: 'intermediate',
      readTime: 8,
      rating: 4.9,
      tags: ['diabetes', 'blood sugar', 'diet', 'exercise'],
      lastUpdated: new Date('2024-01-20')
    },
    {
      id: '3',
      title: 'Heart Attack vs. Panic Attack',
      category: 'emergency',
      description: 'Learn to distinguish between heart attack and panic attack symptoms.',
      content: `
Understanding the difference between a heart attack and panic attack can be life-saving. Both can cause chest pain and anxiety, but they require very different responses.

**Heart Attack Symptoms:**
- Chest pain that may spread to arms, neck, jaw, or back
- Shortness of breath
- Nausea or vomiting
- Cold sweats
- Lightheadedness
- Pain typically lasts more than a few minutes
- May worsen with activity
- Often described as crushing or squeezing pressure

**Panic Attack Symptoms:**
- Sudden onset of intense fear
- Rapid heartbeat
- Sweating
- Trembling or shaking
- Shortness of breath
- Feeling of choking
- Chest pain (sharp or stabbing)
- Nausea
- Dizziness
- Fear of dying or losing control
- Usually peaks within 10 minutes

**Key Differences:**
- Heart attack pain is often crushing; panic attack pain is usually sharp
- Panic attacks typically peak and subside within 10 minutes
- Heart attack symptoms may worsen over time
- Panic attacks are often triggered by stress; heart attacks may occur during rest

**What to Do:**
**If you suspect a heart attack:**
- Call 911 immediately
- Chew an aspirin if not allergic
- Sit down and stay calm
- Loosen tight clothing

**If you suspect a panic attack:**
- Try to stay calm
- Practice deep breathing
- Use grounding techniques (5-4-3-2-1 method)
- Remove yourself from triggers if possible
- Seek medical attention if symptoms are severe or persistent

**When in Doubt:**
If you're unsure whether symptoms indicate a heart attack or panic attack, always seek immediate medical attention. It's better to be safe and have a panic attack evaluated than to miss a heart attack.
      `,
      difficulty: 'beginner',
      readTime: 6,
      rating: 4.7,
      tags: ['emergency', 'heart attack', 'panic attack', 'chest pain'],
      lastUpdated: new Date('2024-01-18')
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'cardiovascular', name: 'Heart Health', icon: Heart },
    { id: 'mental-health', name: 'Mental Health', icon: Brain },
    { id: 'fitness', name: 'Fitness', icon: Activity },
    { id: 'medications', name: 'Medications', icon: Pill },
    { id: 'emergency', name: 'Emergency Care', icon: Stethoscope }
  ];

  const filteredContent = educationalContent.filter(content => {
    const matchesSearch = searchQuery === '' || 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-accent bg-accent/10';
      case 'intermediate': return 'text-warning bg-warning/10';
      case 'advanced': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground';
    }
  };

  const openContent = (content: EducationalContent) => {
    setSelectedContent(content);
    toast({
      title: "Article Opened",
      description: `Now reading: ${content.title}`,
    });
  };

  return (
    <div className="space-y-6">
      {selectedContent ? (
        /* Article View */
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedContent(null)}>
                  ← Back to Education Hub
                </Button>
                <CardTitle className="text-2xl">{selectedContent.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedContent.readTime} min read
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    {selectedContent.rating}
                  </div>
                  <Badge className={getDifficultyColor(selectedContent.difficulty)}>
                    {selectedContent.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-sm leading-relaxed">
              {selectedContent.content}
            </div>
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Last updated: {selectedContent.lastUpdated.toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedContent.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Education Hub View */
        <>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Health Education Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search health topics, conditions, or treatments..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1 text-xs">
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredContent
                    .filter(content => category.id === 'all' || content.category === category.id)
                    .map(content => (
                    <Card key={content.id} className="shadow-card hover:shadow-primary transition-all duration-300 cursor-pointer"
                          onClick={() => openContent(content)}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base line-clamp-2">{content.title}</CardTitle>
                          <Badge className={getDifficultyColor(content.difficulty)}>
                            {content.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {content.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {content.readTime} min
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            {content.rating}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {content.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {content.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{content.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <Button size="sm" className="w-full">
                          <Eye className="h-3 w-3 mr-2" />
                          Read Article
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <Card className="bg-muted/50 border-accent/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                Educational content is provided for informational purposes only and should not replace professional medical advice. Always consult with healthcare professionals for personalized medical guidance.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};