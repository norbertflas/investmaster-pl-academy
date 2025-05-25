
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, Calendar, Award, BookOpen, Clock, Flame, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const UserDashboard = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    totalXP: 750,
    level: 3,
    streakDays: 7,
    modulesCompleted: 3,
    certificatesEarned: 1,
    nextLevelXP: 1000,
    weeklyGoal: 100,
    weeklyProgress: 65
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'module_completed',
      title: 'Ukończono: Podstawy Inwestowania',
      xp: 150,
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      type: 'achievement_earned',
      title: 'Zdobyto osiągnięcie: Pierwszy Krok',
      xp: 50,
      timestamp: '2024-01-15T09:15:00Z'
    },
    {
      id: 3,
      type: 'lesson_completed',
      title: 'Ukończono lekcję: Psychologia Inwestora',
      xp: 25,
      timestamp: '2024-01-14T16:45:00Z'
    }
  ]);

  const [weeklyProgress] = useState([
    { day: 'Pon', xp: 45, goal: 50 },
    { day: 'Wt', xp: 30, goal: 50 },
    { day: 'Śr', xp: 60, goal: 50 },
    { day: 'Czw', xp: 20, goal: 50 },
    { day: 'Pt', xp: 55, goal: 50 },
    { day: 'Sob', xp: 35, goal: 50 },
    { day: 'Ndz', xp: 40, goal: 50 }
  ]);

  const currentProgress = Math.round((userStats.totalXP / userStats.nextLevelXP) * 100);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'module_completed': return <BookOpen className="w-5 h-5 text-green-600" />;
      case 'achievement_earned': return <Award className="w-5 h-5 text-yellow-600" />;
      case 'lesson_completed': return <Target className="w-5 h-5 text-blue-600" />;
      default: return <Star className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h temu`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} dni temu`;
    }
  };

  if (!user) return null;

  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Witaj ponownie, {user.user_metadata?.first_name || 'Inwestorze'}! 👋
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Sprawdź swój postęp i kontynuuj naukę
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Poziom & XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                Poziom {userStats.level}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                {userStats.totalXP} / {userStats.nextLevelXP} XP
              </div>
              <Progress value={currentProgress} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center">
                <Flame className="w-4 h-4 mr-2" />
                Passa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                {userStats.streakDays} dni
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Nie przerywaj passy!
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Moduły
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                {userStats.modulesCompleted}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                Ukończone moduły
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Certyfikaty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                {userStats.certificatesEarned}
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                Zdobyte certyfikaty
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Tygodniowy Postęp
              </CardTitle>
              <CardDescription>
                Cel: {userStats.weeklyGoal} XP dziennie • Osiągnięto: {userStats.weeklyProgress}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={userStats.weeklyProgress} className="h-3" />
                <div className="grid grid-cols-7 gap-2">
                  {weeklyProgress.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {day.day}
                      </div>
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                        <div 
                          className={`absolute bottom-0 w-full transition-all duration-300 ${
                            day.xp >= day.goal ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ height: `${Math.min((day.xp / day.goal) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs font-medium mt-1">
                        {day.xp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                Ostatnia Aktywność
              </CardTitle>
              <CardDescription>
                Twoje najnowsze osiągnięcia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {activity.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      +{activity.xp} XP
                    </Badge>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-center">
                  Zobacz wszystko
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;
