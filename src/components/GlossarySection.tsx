
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, ArrowRight, Globe } from 'lucide-react';

const GlossarySection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Wszystkie', count: 156 },
    { id: 'stocks', name: 'Akcje', count: 45 },
    { id: 'bonds', name: 'Obligacje', count: 23 },
    { id: 'crypto', name: 'Kryptowaluty', count: 34 },
    { id: 'analysis', name: 'Analiza', count: 28 },
    { id: 'trading', name: 'Trading', count: 26 }
  ];

  const glossaryTerms = [
    {
      term: "P/E (Price to Earnings)",
      definition: "Wskaźnik ceny do zysku - stosunek ceny akcji do zysku na akcję",
      category: "analysis",
      example: "Jeśli akcja kosztuje 100 zł, a zysk na akcję wynosi 5 zł, to P/E = 20",
      english: "Price-to-Earnings Ratio"
    },
    {
      term: "GPW",
      definition: "Giełda Papierów Wartościowych w Warszawie - główny rynek akcji w Polsce",
      category: "stocks",
      example: "Na GPW notowane są największe polskie spółki jak PKO BP czy CD Projekt",
      english: "Warsaw Stock Exchange"
    },
    {
      term: "Stop Loss",
      definition: "Zlecenie automatycznego zamknięcia pozycji przy określonej stracie",
      category: "trading",
      example: "Ustawienie stop loss na 5% poniżej ceny zakupu chroni przed większymi stratami",
      english: "Stop Loss Order"
    },
    {
      term: "ETF",
      definition: "Fundusz indeksowy notowany na giełdzie, odwzorowujący określony indeks",
      category: "stocks",
      example: "ETF na WIG20 pozwala inwestować w 20 największych polskich spółek jednocześnie",
      english: "Exchange Traded Fund"
    },
    {
      term: "Blockchain",
      definition: "Zdecentralizowana baza danych składająca się z połączonych bloków",
      category: "crypto",
      example: "Bitcoin wykorzystuje blockchain do rejestrowania wszystkich transakcji",
      english: "Blockchain"
    },
    {
      term: "Dywidenda",
      definition: "Część zysku spółki wypłacana akcjonariuszom",
      category: "stocks",
      example: "PKN Orlen wypłaca dywidendę raz w roku, zwykle w czerwcu",
      english: "Dividend"
    }
  ];

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      stocks: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      bonds: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      crypto: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      analysis: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      trading: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <section id="glossary" className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            📖 Słowniczek Pojęć
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Słowniczek Inwestycyjny
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Kompleksowy zbiór definicji pojęć finansowych i inwestycyjnych. 
            Znajdź wyjaśnienie każdego terminu w języku polskim i angielskim.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Szukaj pojęć..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                  className="mb-2"
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Znaleziono {filteredTerms.length} pojęć
            </p>
          </div>

          {/* Glossary Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTerms.map((term, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover-scale">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary mb-2">
                        {term.term}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getCategoryColor(term.category)}>
                          {categories.find(c => c.id === term.category)?.name}
                        </Badge>
                        {term.english && (
                          <Badge variant="outline" className="text-xs">
                            <Globe className="w-3 h-3 mr-1" />
                            {term.english}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-gray-700 dark:text-gray-300 mb-4 text-base leading-relaxed">
                    {term.definition}
                  </CardDescription>
                  
                  {term.example && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Przykład:</strong> {term.example}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                Nie znaleziono pojęć
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Spróbuj użyć innych słów kluczowych lub zmień kategorię
              </p>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-primary to-blue-600 text-white">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-6">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Nie znalazłeś szukanego pojęcia?
              </h3>
              <p className="text-blue-100 mb-6">
                Napisz do nas, a dodamy nowe definicje do słowniczka. 
                Nasz zespół ekspertów stale rozszerza bazę pojęć.
              </p>
              <Button variant="secondary" size="lg">
                Zaproponuj pojęcie
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlossarySection;
