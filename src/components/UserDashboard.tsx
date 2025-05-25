
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Trophy, 
  Target, 
  Clock, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Star,
  Calendar,
  Zap
} from 'lucide-react';

const UserDashboard = () => {
  const userStats = {
    name: "Jan Kowalski",
    level: 5,
    xp: 2340,
    nextLevelXp: 3000,
    streak: 7,
    completedModules: 3,
    totalModules: 15,
    certificates: 1,
    hoursLearned: 24
  };

  const achievements = [
    { id: 1, name: "Pierwszy Krok", description: "Ukończenie pierwszego modułu", earned: true, icon: "🎯" },
    { id: 2, name: "Znawca GPW", description: "Ukończenie modułu o polskiej giełdzie", earned: true, icon: "🇵🇱" },
    { id: 3, name: "Tygodniowiec", description: "7 dni nauki z rzędu", earned: true, icon: "🔥" },
    { id: 4, name: "Analityk", description: "Ukończenie modułu analizy technicznej", earned: false, icon: "📈" },
    { id: 5, name: "Mistrz AI", description: "Ukończenie modułu o AI w tradingu", earned: false, icon: "🤖" },
    { id: 6, name: "Ekspert", description: "Ukończenie wszystkich modułów", earned: false, icon: "🏆" }
  ];

  const recentActivity = [
    { action: "Ukończono lekcję", module: "Polski Rynek Giełdowy", time: "2 godziny temu", xp: 50 },
    { action: "Zdobyto odznakę", module: "Tygodniowiec", time: "1 dzień temu", xp: 100 },
    { action: "Ukończono test", module: "Wprowadzenie do Inwestowania", time: "2 dni temu", xp: 75 }
  ];

  const recommendedNext = [
    { title: "Analiza Fundamentalna", description: "Naucz się oceniać wartość spółek", duration: "45 min" },
    { title: "Zarządzanie Ryzykiem", description: "Chroń swój kapitał przed stratami", duration: "30 min" },
    { title: "Psychologia Tradingu", description: "Opanuj emocje podczas inwestowania", duration: "35 min" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-financial-gold/10 text-financial-gold border-financial-gold/20">
            👤 Dashboard Użytkownika
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-financial-navy">
            Twój Postęp w Nauce
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="progress">Postęp</TabsTrigger>
              <TabsTrigger value="achievements">Osiągnięcia</TabsTrigger>
              <TabsTrigger value="activity">Aktywność</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Profile Card */}
                <Card className="lg:col-span-1">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-financial-navy to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-xl text-financial-navy">{userStats.name}</CardTitle>
                    <CardDescription>Poziom {userStats.level} Inwestor</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* XP Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Doświadczenie</span>
                        <span className="text-financial-navy font-medium">
                          {userStats.xp}/{userStats.nextLevelXp} XP
                        </span>
                      </div>
                      <Progress value={(userStats.xp / userStats.nextLevelXp) * 100} className="h-3" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-financial-navy">{userStats.streak}</div>
                        <div className="text-sm text-gray-600">Dni z rzędu</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-financial-gold">{userStats.certificates}</div>
                        <div className="text-sm text-gray-600">Certyfikaty</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Overview */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Modules Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-financial-navy" />
                        <span>Postęp w Modułach</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Ukończone moduły</span>
                        <span className="text-financial-navy font-medium">
                          {userStats.completedModules}/{userStats.totalModules}
                        </span>
                      </div>
                      <Progress 
                        value={(userStats.completedModules / userStats.totalModules) * 100} 
                        className="h-3 mb-4" 
                      />
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-financial-navy">{userStats.hoursLearned}h</div>
                          <div className="text-sm text-gray-600">Godzin nauki</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">85%</div>
                          <div className="text-sm text-gray-600">Śr. wynik testów</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-financial-gold">Top 15%</div>
                          <div className="text-sm text-gray-600">Ranking</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommended Next Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-financial-gold" />
                        <span>Rekomendowane Następne Kroki</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recommendedNext.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex-1">
                              <h4 className="font-medium text-financial-navy">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {item.duration}
                              </Badge>
                              <Button size="sm">Rozpocznij</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className={`transition-all duration-300 ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-financial-gold/5 to-yellow-50 border-financial-gold/30 hover-scale' 
                      : 'bg-gray-50 opacity-60'
                  }`}>
                    <CardHeader className="text-center">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <CardTitle className={`text-lg ${
                        achievement.earned ? 'text-financial-navy' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </CardTitle>
                      <CardDescription className={achievement.earned ? 'text-gray-700' : 'text-gray-400'}>
                        {achievement.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      {achievement.earned ? (
                        <Badge className="bg-financial-gold text-white">
                          <Award className="w-3 h-3 mr-1" />
                          Zdobyte
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          Zablokowane
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-financial-navy" />
                    <span>Ostatnia Aktywność</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-financial-navy/10 rounded-full flex items-center justify-center">
                            <Zap className="w-5 h-5 text-financial-navy" />
                          </div>
                          <div>
                            <h4 className="font-medium text-financial-navy">{activity.action}</h4>
                            <p className="text-sm text-gray-600">{activity.module}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{activity.time}</div>
                          <Badge variant="outline" className="mt-1">
                            +{activity.xp} XP
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;
