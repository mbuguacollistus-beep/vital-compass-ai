import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Users, 
  Target, 
  Calendar, 
  Medal, 
  Star,
  TrendingUp,
  Heart,
  Activity,
  Apple,
  Zap
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'steps' | 'weight_loss' | 'meditation' | 'nutrition' | 'sleep' | 'community';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // days
  participants: number;
  maxParticipants?: number;
  reward: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isJoined: boolean;
  progress?: number;
  goal: number;
  unit: string;
  createdBy: string;
  leaderboard: Array<{
    rank: number;
    userId: string;
    username: string;
    avatar?: string;
    score: number;
    improvement: number;
  }>;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const challengeIcons = {
  steps: Activity,
  weight_loss: TrendingUp,
  meditation: Heart,
  nutrition: Apple,
  sleep: Star,
  community: Users
};

const rarityColors = {
  common: 'bg-gray-100',
  rare: 'bg-blue-100',
  epic: 'bg-purple-100', 
  legendary: 'bg-yellow-100'
};

export const HealthChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState({
    completedChallenges: 12,
    totalPoints: 2850,
    currentStreak: 7,
    rank: 'Gold'
  });
  const { toast } = useToast();

  useEffect(() => {
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: '10,000 Steps Daily Challenge',
        description: 'Walk 10,000 steps every day for 30 days. Join the community and stay motivated!',
        type: 'steps',
        difficulty: 'beginner',
        duration: 30,
        participants: 1247,
        maxParticipants: 2000,
        reward: '500 Health Points + Fitness Badge',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        isActive: true,
        isJoined: true,
        progress: 67,
        goal: 10000,
        unit: 'steps/day',
        createdBy: 'Nix Health Team',
        leaderboard: [
          { rank: 1, userId: '1', username: 'HealthWarrior', score: 12450, improvement: 5.2 },
          { rank: 2, userId: '2', username: 'FitLife_Pro', score: 11890, improvement: 3.1 },
          { rank: 3, userId: '3', username: 'WalkingChamp', score: 11234, improvement: 2.8 },
          { rank: 15, userId: 'current', username: 'You', score: 9876, improvement: 1.2 }
        ]
      },
      {
        id: '2',
        title: 'Mindful Meditation Month',
        description: 'Practice 15 minutes of meditation daily. Improve your mental wellness with our community.',
        type: 'meditation',
        difficulty: 'intermediate',
        duration: 30,
        participants: 892,
        reward: '300 Health Points + Zen Master Badge',
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        isActive: true,
        isJoined: false,
        goal: 15,
        unit: 'minutes/day',
        createdBy: 'MindfulnessMaster',
        leaderboard: [
          { rank: 1, userId: '4', username: 'ZenGuru', score: 450, improvement: 8.5 },
          { rank: 2, userId: '5', username: 'CalmMind', score: 420, improvement: 6.2 },
          { rank: 3, userId: '6', username: 'PeacefulSoul', score: 390, improvement: 4.7 }
        ]
      },
      {
        id: '3',
        title: 'Healthy Weight Challenge',
        description: 'Lose 5% body weight safely over 12 weeks with expert guidance and community support.',
        type: 'weight_loss',
        difficulty: 'advanced',
        duration: 84,
        participants: 456,
        maxParticipants: 500,
        reward: '1000 Health Points + Transformation Badge + Nutrition Plan',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 54 * 24 * 60 * 60 * 1000),
        isActive: true,
        isJoined: true,
        progress: 35,
        goal: 5,
        unit: '% weight loss',
        createdBy: 'Dr. Sarah Johnson',
        leaderboard: [
          { rank: 1, userId: '7', username: 'TransformNow', score: 7.2, improvement: 12.3 },
          { rank: 2, userId: '8', username: 'HealthyLife', score: 6.8, improvement: 9.8 },
          { rank: 8, userId: 'current', username: 'You', score: 3.2, improvement: 5.1 }
        ]
      }
    ];

    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'First Steps',
        description: 'Completed your first health challenge',
        icon: '🏃‍♂️',
        unlockedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        rarity: 'common'
      },
      {
        id: '2',
        title: 'Consistency Champion',
        description: 'Maintained a 7-day streak in challenges',
        icon: '🏆',
        unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        rarity: 'rare'
      },
      {
        id: '3',
        title: 'Community Leader',
        description: 'Helped 50+ people in community challenges',
        icon: '👑',
        unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        rarity: 'epic'
      }
    ];

    setChallenges(mockChallenges);
    setAchievements(mockAchievements);
  }, []);

  const joinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isJoined: true, participants: challenge.participants + 1 }
        : challenge
    ));
    toast({
      title: "Challenge Joined!",
      description: "You've successfully joined the challenge. Good luck!",
    });
  };

  const leaveChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isJoined: false, participants: challenge.participants - 1 }
        : challenge
    ));
    toast({
      title: "Left Challenge",
      description: "You've left the challenge. You can rejoin anytime.",
      variant: "destructive"
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{userStats.completedChallenges}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Star className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Zap className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{userStats.currentStreak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Medal className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{userStats.rank}</p>
              <p className="text-sm text-muted-foreground">Current Rank</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Challenges</TabsTrigger>
          <TabsTrigger value="browse">Browse All</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboards</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {challenges.filter(c => c.isJoined && c.isActive).map((challenge) => {
              const ChallengeIcon = challengeIcons[challenge.type];
              const daysRemaining = getDaysRemaining(challenge.endDate);
              
              return (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <ChallengeIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <CardDescription>{challenge.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress: {challenge.progress}%</span>
                        <span>{daysRemaining} days remaining</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {challenge.participants.toLocaleString()} participants
                          </span>
                          <span className="flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            {challenge.goal} {challenge.unit}
                          </span>
                        </div>
                        <Button variant="outline" onClick={() => leaveChallenge(challenge.id)}>
                          Leave Challenge
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="browse" className="space-y-4">
          <div className="grid gap-4">
            {challenges.map((challenge) => {
              const ChallengeIcon = challengeIcons[challenge.type];
              const daysRemaining = getDaysRemaining(challenge.endDate);
              
              return (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <ChallengeIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <CardDescription>{challenge.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        {challenge.isJoined && <Badge variant="default">Joined</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {challenge.duration} days
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {challenge.participants.toLocaleString()} participants
                        </span>
                        <span>{daysRemaining} days remaining</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Reward: {challenge.reward}</p>
                          <p className="text-sm text-muted-foreground">By {challenge.createdBy}</p>
                        </div>
                        {challenge.isJoined ? (
                          <Button variant="outline" onClick={() => leaveChallenge(challenge.id)}>
                            Leave
                          </Button>
                        ) : (
                          <Button onClick={() => joinChallenge(challenge.id)}>
                            Join Challenge
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          {challenges.filter(c => c.isJoined).map((challenge) => (
            <Card key={challenge.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(challengeIcons[challenge.type], { className: "h-5 w-5" })}
                  {challenge.title} - Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {challenge.leaderboard.map((entry) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        entry.userId === 'current' ? 'bg-primary/5 border-primary/20' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                          {entry.rank <= 3 ? (
                            <Trophy className={`h-4 w-4 ${
                              entry.rank === 1 ? 'text-yellow-500' : 
                              entry.rank === 2 ? 'text-gray-400' : 'text-amber-600'
                            }`} />
                          ) : (
                            <span className="text-sm font-medium">#{entry.rank}</span>
                          )}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={entry.avatar} />
                          <AvatarFallback>{entry.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{entry.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.improvement > 0 ? '+' : ''}{entry.improvement}% this week
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{entry.score.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{challenge.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`${rarityColors[achievement.rarity]} border-2`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{achievement.rarity}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {achievement.unlockedAt.toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};