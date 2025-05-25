
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Brain, Clock, Star, ArrowRight, CheckCircle } from 'lucide-react';

const PersonalizedLearning = () => {
  const learningPath = [
    {
      id: 1,
      title: "Wprowadzenie do Inwestowania",
      description: "Podstawy i psychologia rynków",
      progress: 100,
      status: "completed",
      estimatedTime: "8h",
      difficulty: "beginner"
    },
    {
      id: 2,
      title: "Polski Rynek Giełdowy",
      description: "GPW, NewConnect, polskie spółki",
      progress: 60,
      status: "in_progress",
      estimatedTime: "12h",
      difficulty: "intermediate"
    },
    {
      id: 3,
      title: "Analiza Fundamentalna",
      description: "Ocena wartości spółek",
      progress: 0,
      status: "locked",
      estimatedTime: "10h",
      difficulty: "intermediate"
    },
    {
      id: 4,
      title: "Zarządzanie Ryzykiem",
      description: "Ochrona kapitału",
      progress: 0,
      status: "recommended",
      estimatedTime: "6h",
      difficulty: "advanced"
    }
  ];

  const personalizedRecommendations = [
    {
      title: "Dokończ analizę polskich spółek",
      description: "Zostało Ci 4 lekcje w module o polskim rynku",
      priority: "high",
      timeToComplete: "2h"
    },
    {
      title: "Przeczytaj studium: Sukces CD Projekt",
      description: "Pasuje do Twoich zainteresowań grami",
      priority: "medium",
      timeToComplete: "30min"
    },
    {
      title: "Wykonaj test z analizy technicznej",
      description: "Sprawdź swoją wiedzę przed kolejnym modułem",
      priority: "low",
      timeToComplete: "15min"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'recommended': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-green-500';
      default: return '';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            🎯 Personalizowana Ścieżka
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Twoja Ścieżka Nauki
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Dostosowana do Twoich celów, tempa i poziomu zaawansowania.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Learning Path */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>Twoja Ścieżka Nauki</span>
                </CardTitle>
                <CardDescription>
                  Rekomendowane moduły dostosowane do Twoich preferencji
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {learningPath.map((module, index) => (
                  <div key={module.id} className="relative">
                    {/* Connection Line */}
                    {index < learningPath.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200 dark:bg-gray-700 z-0"></div>
                    )}
                    
                    <div className="flex items-start space-x-4 relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        module.status === 'completed' 
                          ? 'bg-green-500' 
                          : module.status === 'in_progress'
                          ? 'bg-blue-500'
                          : module.status === 'recommended'
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                      }`}>
                        {module.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <span className="text-white font-bold">{module.id}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg text-primary">{module.title}</h3>
                          <Badge className={getStatusColor(module.status)}>
                            {module.status === 'completed' && 'Ukończony'}
                            {module.status === 'in_progress' && 'W trakcie'}
                            {module.status === 'recommended' && 'Polecany'}
                            {module.status === 'locked' && 'Zablokowany'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-3">{module.description}</p>
                        
                        {module.progress > 0 && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Postęp</span>
                              <span>{module.progress}%</span>
                            </div>
                            <Progress value={module.progress} className="h-2" />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {module.estimatedTime}
                            </span>
                            <Badge variant="outline" size="sm">
                              {module.difficulty === 'beginner' && 'Początkujący'}
                              {module.difficulty === 'intermediate' && 'Średni'}
                              {module.difficulty === 'advanced' && 'Zaawansowany'}
                            </Badge>
                          </div>
                          
                          <Button 
                            size="sm" 
                            disabled={module.status === 'locked'}
                            variant={module.status === 'completed' ? 'outline' : 'default'}
                          >
                            {module.status === 'completed' ? 'Powtórz' : 
                             module.status === 'in_progress' ? 'Kontynuuj' : 'Rozpocznij'}
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recommendations Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span>Rekomendacje AI</span>
                </CardTitle>
                <CardDescription>
                  Personalizowane sugestie na podstawie Twojego postępu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {personalizedRecommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg bg-slate-50 dark:bg-slate-800 ${getPriorityColor(rec.priority)}`}>
                    <h4 className="font-medium text-primary mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{rec.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" size="sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {rec.timeToComplete}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span>Twoje Statystyki</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">85%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Średni wynik testów</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">3</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Ukończone moduły</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">24h</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Czas nauki</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedLearning;
