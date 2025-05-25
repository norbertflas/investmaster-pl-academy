
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, TrendingUp, Clock, Award, Target, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const PersonalizedLearning = () => {
  const { user } = useAuth();
  const [userLevel, setUserLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(250);
  const [nextLevelXP] = useState(500);

  // Mock data - w przyszłości będzie pobierane z bazy danych
  const [personalizedPath] = useState([
    {
      id: 1,
      title: "Podstawy Inwestowania",
      description: "Zrozum fundamenty świata inwestycji",
      progress: 100,
      xp: 150,
      completed: true,
      modules: ["Wprowadzenie", "Psychologia inwestora", "Zarządzanie ryzykiem"]
    },
    {
      id: 2,
      title: "Analiza Techniczna",
      description: "Naucz się czytać wykresy i wskaźniki",
      progress: 65,
      xp: 100,
      completed: false,
      modules: ["Podstawy AT", "Wskaźniki momentum", "Formacje cenowe"]
    },
    {
      id: 3,
      title: "Polski Rynek Giełdowy",
      description: "Poznaj specyfikę GPW i polskich spółek",
      progress: 0,
      xp: 0,
      completed: false,
      modules: ["Historia GPW", "Sektory gospodarki", "Analiza spółek"]
    }
  ]);

  const [recommendations] = useState([
    {
      type: "module",
      title: "Dokończ: Wskaźniki Momentum",
      description: "Pozostało ci 2 lekcje do ukończenia tego modułu",
      urgency: "high",
      xp: 50
    },
    {
      type: "case_study",
      title: "Analiza: Krach Dot-Com 2000",
      description: "Idealne studium przypadku dla twojego poziomu",
      urgency: "medium",
      xp: 30
    },
    {
      type: "skill_gap",
      title: "Uzupełnij: Analiza Fundamentalna",
      description: "Ta umiejętność pomoże ci w ocenie spółek",
      urgency: "low",
      xp: 75
    }
  ]);

  const [achievements] = useState([
    { name: "Pierwszy Krok", description: "Ukończono pierwszy moduł", earned: true },
    { name: "Analityk", description: "Ukończono 3 moduły analizy", earned: false },
    { name: "Polski Ekspert", description: "Zdobyto wiedzę o polskim rynku", earned: false }
  ]);

  const currentProgress = Math.round((totalXP / nextLevelXP) * 100);

  if (!user) {
    return (
      <section id="personalized-learning" className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Spersonalizowana Ścieżka Nauki
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Zaloguj się, aby uzyskać dostęp do spersonalizowanych rekomendacji
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <BookOpen className="w-5 h-5 mr-2" />
              Rozpocznij Naukę
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="personalized-learning" className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Twoja Spersonalizowana Ścieżka
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Dostosowana do Twojego tempa i celów inwestycyjnych
          </p>
        </div>

        {/* User Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Twój Postęp
              </CardTitle>
              <CardDescription>
                Poziom {userLevel} • {totalXP} / {nextLevelXP} XP do następnego poziomu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={currentProgress} className="mb-4" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{personalizedPath.filter(p => p.completed).length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ukończone moduły</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{totalXP}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Zdobyte XP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{achievements.filter(a => a.earned).length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Osiągnięcia</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-600" />
                Najnowsze Osiągnięcia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${achievement.earned ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <div className="font-medium text-sm">{achievement.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personalized Learning Path */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Twoja Ścieżka Nauki</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalizedPath.map((path) => (
              <Card key={path.id} className={`transition-all duration-200 hover:shadow-lg ${path.completed ? 'border-green-200 bg-green-50 dark:bg-green-950' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                    {path.completed && <Badge variant="outline" className="text-green-700 border-green-300">Ukończono</Badge>}
                  </div>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Postęp</span>
                        <span>{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Moduły:</div>
                      {path.modules.map((module, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-1">
                          {module}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{path.xp} XP</span> zdobyte
                      </div>
                      <Button variant={path.completed ? "outline" : "default"} size="sm">
                        {path.completed ? "Przejrzyj" : "Kontynuuj"}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Smart Recommendations */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Rekomendacje dla Ciebie</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      {rec.type === 'module' && <BookOpen className="w-5 h-5 mr-2 text-blue-600" />}
                      {rec.type === 'case_study' && <Target className="w-5 h-5 mr-2 text-green-600" />}
                      {rec.type === 'skill_gap' && <Clock className="w-5 h-5 mr-2 text-orange-600" />}
                      {rec.title}
                    </CardTitle>
                    <Badge 
                      variant="outline" 
                      className={
                        rec.urgency === 'high' ? 'text-red-700 border-red-300' :
                        rec.urgency === 'medium' ? 'text-yellow-700 border-yellow-300' :
                        'text-gray-700 border-gray-300'
                      }
                    >
                      {rec.urgency === 'high' ? 'Priorytet' :
                       rec.urgency === 'medium' ? 'Ważne' : 'Opcjonalne'}
                    </Badge>
                  </div>
                  <CardDescription>{rec.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">+{rec.xp} XP</span>
                    </div>
                    <Button size="sm">
                      Rozpocznij
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedLearning;
