
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Globe, TrendingDown, TrendingUp, Target, ChevronRight } from 'lucide-react';

const CaseStudiesSection = () => {
  const [caseStudies] = useState([
    {
      id: 1,
      title: "Krach Dot-Com 2000",
      description: "Analiza bańki internetowej i jej pęknięcia na przełomie tysiącleci",
      category: "Historyczne kryzysy",
      difficulty: "Średniozaawansowany",
      market: "USA",
      assetClass: "Akcje Tech",
      date: "2000-2002",
      impact: "negative",
      keyLessons: ["Znaczenie wyceny fundamentalnej", "Psychologia tłumu", "Sygnały ostrzegawcze"],
      readTime: "15 min"
    },
    {
      id: 2,
      title: "Sukces CD Projekt",
      description: "Historia wzrostu polskiej spółki gamingowej od dystrybutora do globalnego dewelopera",
      category: "Analiza spółek",
      difficulty: "Początkujący",
      market: "Polska",
      assetClass: "Akcje",
      date: "2010-2020",
      impact: "positive",
      keyLessons: ["Znaczenie innowacji", "Budowanie marki", "Ryzyko projektowe"],
      readTime: "12 min"
    },
    {
      id: 3,
      title: "Kryzys Finansowy 2008",
      description: "Globalny kryzys finansowy wywołany przez kredyty subprime",
      category: "Historyczne kryzysy",
      difficulty: "Zaawansowany",
      market: "Globalny",
      assetClass: "Instrumenty finansowe",
      date: "2007-2009",
      impact: "negative",
      keyLessons: ["Ryzyko systemowe", "Znaczenie regulacji", "Zarządzanie ryzykiem"],
      readTime: "20 min"
    },
    {
      id: 4,
      title: "Wzrost Tesla",
      description: "Jak Tesla stała się najcenniejszą firmą motoryzacyjną na świecie",
      category: "Analiza spółek",
      difficulty: "Średniozaawansowany",
      market: "USA",
      assetClass: "Akcje",
      date: "2010-2021",
      impact: "positive",
      keyLessons: ["Wizja długoterminowa", "Innowacje technologiczne", "Zmienność rynku"],
      readTime: "18 min"
    },
    {
      id: 5,
      title: "Boom na Bitcoin 2017",
      description: "Analiza spekulacyjnej bańki na rynku kryptowalut",
      category: "Rynki alternatywne",
      difficulty: "Średniozaawansowany",
      market: "Globalny",
      assetClass: "Kryptowaluty",
      date: "2017-2018",
      impact: "mixed",
      keyLessons: ["Nowe klasy aktywów", "Mania spekulacyjna", "Regulacje rynkowe"],
      readTime: "14 min"
    },
    {
      id: 6,
      title: "Pandemia i rynki 2020",
      description: "Wpływ COVID-19 na globalne rynki finansowe i reakcja banków centralnych",
      category: "Zdarzenia makro",
      difficulty: "Zaawansowany",
      market: "Globalny",
      assetClass: "Wszystkie",
      date: "2020-2021",
      impact: "mixed",
      keyLessons: ["Zdarzenia typu Black Swan", "Polityka monetarna", "Adaptacja biznesowa"],
      readTime: "16 min"
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

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'negative': return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'mixed': return <Target className="w-5 h-5 text-yellow-600" />;
      default: return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <section id="case-studies" className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Studia Przypadków
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ucz się na prawdziwych przykładach z historii rynków finansowych
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study) => (
            <Card key={study.id} className="group hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  {getImpactIcon(study.impact)}
                  <Badge variant="outline" className={getDifficultyColor(study.difficulty)}>
                    {study.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {study.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {study.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Rynek</div>
                    <div className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {study.market}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Okres</div>
                    <div className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {study.date}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">Kluczowe lekcje:</div>
                  <div className="space-y-1">
                    {study.keyLessons.slice(0, 2).map((lesson, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {lesson}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <Badge variant="outline" className="text-xs">
                      {study.category}
                    </Badge>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {study.readTime}
                    </div>
                  </div>
                </div>

                <Button className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  Czytaj studium
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Zobacz wszystkie studia przypadków
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
