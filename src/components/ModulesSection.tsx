
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, TrendingUp, Shield, BarChart3, Brain, Award, PlayCircle, Lock } from 'lucide-react';

const modules = [
  {
    id: 1,
    title: "Wprowadzenie do Inwestowania",
    description: "Podstawy inwestowania, psychologia rynków, zarządzanie ryzykiem",
    icon: BookOpen,
    level: "Początkujący",
    duration: "8 godzin",
    progress: 75,
    lessons: 12,
    isUnlocked: true,
    badge: "Popularny"
  },
  {
    id: 2,
    title: "Polski Rynek Giełdowy",
    description: "GPW, NewConnect, analiza polskich spółek, podatki i regulacje",
    icon: TrendingUp,
    level: "Średniozaawansowany",
    duration: "12 godzin",
    progress: 45,
    lessons: 18,
    isUnlocked: true,
    badge: "Ekskluzywny"
  },
  {
    id: 3,
    title: "Klasy Aktywów",
    description: "Akcje, obligacje, ETF, kryptowaluty, nieruchomości, metale szlachetne",
    icon: BarChart3,
    level: "Początkujący",
    duration: "15 godzin",
    progress: 20,
    lessons: 24,
    isUnlocked: true
  },
  {
    id: 4,
    title: "Analiza Techniczna",
    description: "Wykresy, wskaźniki, formacje, narzędzia analityczne",
    icon: BarChart3,
    level: "Średniozaawansowany",
    duration: "10 godzin",
    progress: 0,
    lessons: 16,
    isUnlocked: false
  },
  {
    id: 5,
    title: "AI w Tradingu",
    description: "Sztuczna inteligencja, algorytmy, backtesting, robo-doradztwo",
    icon: Brain,
    level: "Zaawansowany",
    duration: "6 godzin",
    progress: 0,
    lessons: 10,
    isUnlocked: false,
    badge: "Nowość"
  },
  {
    id: 6,
    title: "Zarządzanie Portfelem",
    description: "Dywersyfikacja, rebalansowanie, strategie długoterminowe",
    icon: Shield,
    level: "Średniozaawansowany",
    duration: "8 godzin",
    progress: 0,
    lessons: 14,
    isUnlocked: false
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Początkujący": return "bg-green-100 text-green-800";
    case "Średniozaawansowany": return "bg-yellow-100 text-yellow-800";
    case "Zaawansowany": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const ModulesSection = () => {
  return (
    <section id="modules" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-financial-navy/10 text-financial-navy border-financial-navy/20">
            📚 Moduły Edukacyjne
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-financial-navy">
            Twoja Ścieżka do Sukcesu
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Każdy moduł został starannie zaprojektowany, aby przekazać Ci praktyczną wiedzę
            i umiejętności potrzebne do odniesienia sukcesu na rynkach finansowych.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Card key={module.id} className={`relative overflow-hidden hover-scale transition-all duration-300 ${
                module.isUnlocked ? 'hover:shadow-lg' : 'opacity-75'
              }`}>
                {/* Badge */}
                {module.badge && (
                  <Badge className="absolute top-4 right-4 z-10 bg-financial-gold text-white">
                    {module.badge}
                  </Badge>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      module.isUnlocked ? 'bg-financial-navy' : 'bg-gray-400'
                    }`}>
                      {module.isUnlocked ? (
                        <IconComponent className="w-6 h-6 text-white" />
                      ) : (
                        <Lock className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <Badge variant="outline" className={getLevelColor(module.level)}>
                      {module.level}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl text-financial-navy">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-2">
                    {module.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Progress */}
                  {module.isUnlocked && module.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Postęp</span>
                        <span className="text-financial-navy font-medium">{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-gray-600 mb-6">
                    <span>📖 {module.lessons} lekcji</span>
                    <span>⏱️ {module.duration}</span>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className={`w-full ${
                      module.isUnlocked 
                        ? 'bg-financial-navy hover:bg-blue-800' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!module.isUnlocked}
                  >
                    {module.isUnlocked ? (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        {module.progress > 0 ? 'Kontynuuj' : 'Rozpocznij'}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Zablokowany
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-financial-navy to-blue-600 text-white">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-6">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Zdobądź Certyfikat InvestMaster PL
            </h3>
            <p className="text-blue-100 mb-6">
              Ukończ wszystkie moduły i zdobądź oficjalny certyfikat potwierdzający
              Twoje kompetencje inwestycyjne.
            </p>
            <Button variant="secondary" size="lg">
              Dowiedz się więcej
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
