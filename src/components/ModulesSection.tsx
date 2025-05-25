
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Users, ChevronRight, Star, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const ModulesSection = () => {
  const { user } = useAuth();
  
  const [modules] = useState([
    {
      id: 1,
      title: "Podstawy Inwestowania",
      description: "Poznaj fundamenty świata finansów i inwestycji",
      duration: "4-6 godzin",
      lessons: 12,
      difficulty: "Początkujący",
      progress: user ? 100 : 0,
      category: "fundamentals",
      topics: ["Psychologia inwestora", "Zarządzanie ryzykiem", "Dywersyfikacja"],
      rating: 4.8,
      students: 1250
    },
    {
      id: 2,
      title: "Analiza Techniczna",
      description: "Naucz się czytać wykresy i przewidywać trendy",
      duration: "6-8 godzin",
      lessons: 18,
      difficulty: "Średniozaawansowany",
      progress: user ? 65 : 0,
      category: "analysis",
      topics: ["Wskaźniki momentum", "Formacje cenowe", "Poziomy wsparcia"],
      rating: 4.7,
      students: 890
    },
    {
      id: 3,
      title: "Analiza Fundamentalna",
      description: "Oceń prawdziwą wartość spółek i aktywów",
      duration: "8-10 godzin",
      lessons: 24,
      difficulty: "Średniozaawansowany",
      progress: user ? 30 : 0,
      category: "analysis",
      topics: ["Sprawozdania finansowe", "Wskaźniki rentowności", "Wycena spółek"],
      rating: 4.9,
      students: 720
    },
    {
      id: 4,
      title: "Polski Rynek Giełdowy",
      description: "Specyfika GPW i polskich spółek",
      duration: "5-7 godzin",
      lessons: 15,
      difficulty: "Początkujący",
      progress: user ? 0 : 0,
      category: "markets",
      topics: ["Historia GPW", "Indeksy giełdowe", "Sektory gospodarki"],
      rating: 4.6,
      students: 650
    },
    {
      id: 5,
      title: "Inwestowanie w ETF",
      description: "Pasywne inwestowanie i budowanie portfela",
      duration: "3-4 godziny",
      lessons: 10,
      difficulty: "Początkujący",
      progress: user ? 0 : 0,
      category: "instruments",
      topics: ["Czym są ETF", "Koszty i opłaty", "Strategie portfelowe"],
      rating: 4.5,
      students: 980
    },
    {
      id: 6,
      title: "Zarządzanie Ryzykiem",
      description: "Ochrona kapitału i zaawansowane strategie",
      duration: "6-8 godzin",
      lessons: 16,
      difficulty: "Zaawansowany",
      progress: user ? 0 : 0,
      category: "risk",
      topics: ["Stop loss", "Position sizing", "Hedging"],
      rating: 4.8,
      students: 420
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Początkujący': return 'bg-green-100 text-green-800 border-green-200';
      case 'Średniozaawansowany': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Zaawansowany': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fundamentals': return <BookOpen className="w-5 h-5" />;
      case 'analysis': return <TrendingUp className="w-5 h-5" />;
      case 'markets': return <Target className="w-5 h-5" />;
      case 'instruments': return <Star className="w-5 h-5" />;
      case 'risk': return <Users className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <section id="modules" className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Moduły Edukacyjne
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Kompleksowy program nauki od podstaw do zaawansowanych strategii inwestycyjnych
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <Card key={module.id} className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-blue-600 dark:text-blue-400">
                    {getCategoryIcon(module.category)}
                  </div>
                  <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
                    {module.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {module.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {user && module.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Postęp</span>
                      <span className="font-medium">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-sm font-medium mb-2">Główne tematy:</div>
                  <div className="flex flex-wrap gap-1">
                    {module.topics.slice(0, 2).map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {module.topics.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{module.topics.length - 2} więcej
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {module.duration}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {module.lessons} lekcji
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{module.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-1" />
                      {module.students}
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors"
                  variant={user && module.progress > 0 ? "outline" : "default"}
                >
                  {user && module.progress > 0 ? "Kontynuuj" : user && module.progress === 100 ? "Przejrzyj" : "Rozpocznij"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Zobacz wszystkie moduły
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
