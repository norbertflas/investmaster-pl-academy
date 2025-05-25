
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, BookOpen, Target, Calendar, Award, TrendingUp, Star, Clock } from 'lucide-react';

const LearningProgress = () => {
  const [userStats] = useState({
    level: 3,
    totalXP: 2450,
    nextLevelXP: 3000,
    streak: 12,
    completedModules: 8,
    totalModules: 15,
    certificates: 2,
    studyTimeToday: 45,
    studyTimeWeek: 285
  });

  const [achievements] = useState([
    {
      id: 1,
      title: "Pierwszy krok",
      description: "Ukończono pierwszy moduł",
      icon: "🎯",
      earned: true,
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Seria zwycięstw",
      description: "7 dni nauki pod rząd",
      icon: "🔥",
      earned: true,
      date: "2024-01-20"
    },
    {
      id: 3,
      title: "Analityk",
      description: "Ukończono moduł analizy fundamentalnej",
      icon: "📊",
      earned: true,
      date: "2024-01-22"
    },
    {
      id: 4,
      title: "Quiz Master",
      description: "100% poprawnych odpowiedzi w quizie",
      icon: "🏆",
      earned: false,
      date: null
    },
    {
      id: 5,
      title: "Konsystentny",
      description: "30 dni nauki pod rząd",
      icon: "⭐",
      earned: false,
      date: null
    }
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      type: "module",
      title: "Ukończono: Analiza techniczna - Wskaźniki",
      points: 150,
      time: "2 godziny temu"
    },
    {
      id: 2,
      type: "quiz",
      title: "Quiz: Podstawy inwestowania - 85%",
      points: 85,
      time: "1 dzień temu"
    },
    {
      id: 3,
      type: "achievement",
      title: "Zdobyto osiągnięcie: Analityk",
      points: 200,
      time: "2 dni temu"
    },
    {
      id: 4,
      type: "module",
      title: "Ukończono: ETF i fundusze inwestycyjne",
      points: 120,
      time: "3 dni temu"
    }
  ]);

  const progressPercentage = (userStats.totalXP / userStats.nextLevelXP) * 100;
  const moduleProgress = (userStats.completedModules / userStats.totalModules) * 100;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'module': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'quiz': return <Target className="w-4 h-4 text-green-500" />;
      case 'achievement': return <Trophy className="w-4 h-4 text-yellow-500" />;
      default: return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Twój Postęp w Nauce
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Śledź swoje osiągnięcia i rozwijaj umiejętności inwestycyjne
        </p>
      </div>

      {/* Główne statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Poziom {userStats.level}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {userStats.totalXP} / {userStats.nextLevelXP} XP
                </div>
              </div>
            </div>
            <Progress value={progressPercentage} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {userStats.completedModules}/{userStats.totalModules}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Moduły ukończone
                </div>
              </div>
            </div>
            <Progress value={moduleProgress} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {userStats.streak}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Dni z rzędu
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {userStats.certificates}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Certyfikaty
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Przegląd</TabsTrigger>
          <TabsTrigger value="achievements">Osiągnięcia</TabsTrigger>
          <TabsTrigger value="activity">Aktywność</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Czas nauki</span>
                </CardTitle>
                <CardDescription>
                  Twoja aktywność w nauce
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <div className="font-semibold">Dzisiaj</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Czas nauki
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {userStats.studyTimeToday} min
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <div className="font-semibold">Ten tydzień</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Łączny czas
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.floor(userStats.studyTimeWeek / 60)}h {userStats.studyTimeWeek % 60}m
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Cel tygodniowy</h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <Progress value={(userStats.studyTimeWeek / 300) * 100} className="flex-1" />
                      <span className="text-sm">{userStats.studyTimeWeek}/300 min</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Świetnie! Przekroczyłeś cel tygodniowy o {userStats.studyTimeWeek - 300} minut.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kolejne kroki</CardTitle>
                <CardDescription>
                  Rekomendowane moduły do kontynuacji nauki
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Analiza techniczna - Świece</h4>
                      <Badge variant="outline">Następny</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Naucz się interpretacji formacji świecowych
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Czas: ~45 min | XP: 180
                      </div>
                      <Button size="sm">Rozpocznij</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Psychologia inwestowania</h4>
                      <Badge variant="outline">Polecane</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Opanuj emocje na rynkach finansowych
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Czas: ~30 min | XP: 150
                      </div>
                      <Button size="sm" variant="outline">Zobacz</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Inwestycje w kryptowaluty</h4>
                      <Badge variant="outline">Zaawansowany</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Wprowadzenie do świata kryptowalut
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Czas: ~60 min | XP: 220
                      </div>
                      <Button size="sm" variant="outline">Zobacz</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10' : 'opacity-60'}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {achievement.description}
                    </p>
                    {achievement.earned ? (
                      <div className="space-y-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Zdobyte!
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {achievement.date}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Do zdobycia
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Ostatnia aktywność</CardTitle>
              <CardDescription>
                Historia Twoich działań na platformie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-gray-500">{activity.time}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">+{activity.points} XP</Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">Zobacz pełną historię</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningProgress;
