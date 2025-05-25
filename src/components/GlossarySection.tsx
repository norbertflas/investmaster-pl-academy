
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, TrendingUp, Building, Coins, ChevronRight } from 'lucide-react';

const GlossarySection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [glossaryTerms] = useState([
    {
      id: 1,
      term: "P/E Ratio",
      definition: "Wskaźnik cena/zysk pokazuje stosunek ceny akcji do zysku na akcję spółki",
      category: "analysis",
      difficulty: "basic",
      examples: ["Jeśli akcja kosztuje 100 zł, a zysk na akcję to 10 zł, P/E = 10"],
      relatedTerms: ["P/B Ratio", "ROE", "Kapitalizacja"]
    },
    {
      id: 2,
      term: "Stop Loss",
      definition: "Zlecenie automatycznego zamknięcia pozycji przy określonym poziomie straty",
      category: "trading",
      difficulty: "basic",
      examples: ["Kupujesz akcje za 100 zł i ustawiasz stop loss na 90 zł"],
      relatedTerms: ["Take Profit", "Zarządzanie ryzykiem", "Zlecenie warunkowe"]
    },
    {
      id: 3,
      term: "ETF",
      definition: "Exchange Traded Fund - fundusz inwestycyjny notowany na giełdzie jak akcje",
      category: "instruments",
      difficulty: "basic",
      examples: ["ETF na WIG20 odwzorowuje zachowanie indeksu WIG20"],
      relatedTerms: ["Fundusz indeksowy", "Dywersyfikacja", "Koszty TER"]
    },
    {
      id: 4,
      term: "Dywersyfikacja",
      definition: "Strategia rozłożenia ryzyka poprzez inwestowanie w różne aktywa",
      category: "strategy",
      difficulty: "basic",
      examples: ["Inwestowanie w akcje, obligacje i nieruchomości jednocześnie"],
      relatedTerms: ["Korelacja", "Alokacja aktywów", "Portfel inwestycyjny"]
    },
    {
      id: 5,
      term: "Spread",
      definition: "Różnica między ceną kupna a ceną sprzedaży instrumentu finansowego",
      category: "trading",
      difficulty: "intermediate",
      examples: ["Cena kupna: 100,50 zł, cena sprzedaży: 100,30 zł, spread: 0,20 zł"],
      relatedTerms: ["Bid/Ask", "Płynność", "Market maker"]
    },
    {
      id: 6,
      term: "Kapitalizacja rynkowa",
      definition: "Łączna wartość wszystkich akcji spółki na rynku",
      category: "analysis",
      difficulty: "basic",
      examples: ["1 mln akcji × 50 zł/akcja = 50 mln zł kapitalizacji"],
      relatedTerms: ["Free float", "Akcje w obrocie", "Indeks giełdowy"]
    },
    {
      id: 7,
      term: "EBITDA",
      definition: "Zysk przed odsetkami, podatkami, deprecjacją i amortyzacją",
      category: "analysis",
      difficulty: "advanced",
      examples: ["Zysk operacyjny + amortyzacja = EBITDA"],
      relatedTerms: ["EBIT", "Cash flow", "Rentowność operacyjna"]
    },
    {
      id: 8,
      term: "Inflacja",
      definition: "Wzrost ogólnego poziomu cen w gospodarce",
      category: "macroeconomics",
      difficulty: "basic",
      examples: ["Inflacja 5% oznacza, że ceny wzrosły średnio o 5% w ciągu roku"],
      relatedTerms: ["Deflacja", "CPI", "Stopy procentowe"]
    }
  ]);

  const categories = [
    { id: 'all', name: 'Wszystkie', icon: BookOpen },
    { id: 'analysis', name: 'Analiza', icon: TrendingUp },
    { id: 'trading', name: 'Trading', icon: Coins },
    { id: 'instruments', name: 'Instrumenty', icon: Building },
    { id: 'strategy', name: 'Strategia', icon: Target },
    { id: 'macroeconomics', name: 'Makroekonomia', icon: Globe }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'Podstawowy';
      case 'intermediate': return 'Średniozaawansowany';
      case 'advanced': return 'Zaawansowany';
      default: return 'Podstawowy';
    }
  };

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="glossary" className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Słowniczek Inwestycyjny
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Poznaj kluczowe pojęcia ze świata finansów i inwestycji
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Szukaj terminu lub definicji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map((term) => (
            <Card key={term.id} className="group hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {categories.find(c => c.id === term.category)?.name || term.category}
                  </Badge>
                  <Badge variant="outline" className={getDifficultyColor(term.difficulty)}>
                    {getDifficultyText(term.difficulty)}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {term.term}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {term.definition}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {term.examples && term.examples.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">
                      Przykład:
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                      "{term.examples[0]}"
                    </div>
                  </div>
                )}

                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">
                    Powiązane terminy:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {term.relatedTerms.slice(0, 3).map((relatedTerm, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {relatedTerm}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button variant="ghost" className="w-full text-left justify-start p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  Zobacz szczegóły
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Brak wyników
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Spróbuj zmienić kryteria wyszukiwania lub kategorię
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Zobacz pełny słowniczek
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GlossarySection;
