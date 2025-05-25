
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, TrendingUp, Coins, Building } from 'lucide-react';

const glossaryData = {
  gielda: [
    {
      term: "P/E (Price to Earnings)",
      definition: "Wskaźnik ceny do zysku, pokazujący ile inwestorzy są skłonni zapłacić za każdą złotówkę zysku spółki.",
      example: "Jeśli akcja kosztuje 100 zł, a zysk na akcję wynosi 10 zł, to P/E = 10.",
      category: "Analiza fundamentalna"
    },
    {
      term: "Volatility (Zmienność)",
      definition: "Miara wahań ceny instrumentu finansowego w określonym czasie.",
      example: "Wysoka zmienność oznacza duże wahania cen, niski ryzyko ale i mniejsze potencjalne zyski.",
      category: "Analiza techniczna"
    },
    {
      term: "Dywidenda",
      definition: "Część zysku spółki wypłacana akcjonariuszom proporcjonalnie do posiadanych akcji.",
      example: "Spółka wypłaca 2 zł dywidendy na akcję, mając 100 akcji otrzymasz 200 zł.",
      category: "Inwestowanie"
    }
  ],
  krypto: [
    {
      term: "Blockchain",
      definition: "Rozproszona baza danych składająca się z chronologicznie powiązanych bloków transakcji.",
      example: "Bitcoin wykorzystuje blockchain do przechowywania historii wszystkich transakcji.",
      category: "Technologia"
    },
    {
      term: "HODL",
      definition: "Strategia długoterminowego trzymania kryptowalut niezależnie od wahań cen.",
      example: "Inwestor HODLuje Bitcoin od 2017 roku mimo wszystkich spadków i wzrostów.",
      category: "Strategie"
    },
    {
      term: "DeFi",
      definition: "Zdecentralizowane finanse - ekosystem usług finansowych opartych na blockchain.",
      example: "Platformy jak Uniswap umożliwiają wymianę tokenów bez tradycyjnych pośredników.",
      category: "Produkty"
    }
  ],
  nieruchomosci: [
    {
      term: "Cap Rate",
      definition: "Stopa kapitalizacji - stosunek rocznego dochodu z nieruchomości do jej wartości rynkowej.",
      example: "Nieruchomość za 500,000 zł generuje 25,000 zł rocznie, Cap Rate = 5%.",
      category: "Wycena"
    },
    {
      term: "REITs",
      definition: "Fundusze Inwestycyjne Rynku Nieruchomości - spółki inwestujące w nieruchomości.",
      example: "Echo Investment to jeden z większych REITs na polskim rynku.",
      category: "Instrumenty"
    },
    {
      term: "Flipping",
      definition: "Strategia szybkiej odsprzedaży nieruchomości po remoncie w celu osiągnięcia zysku.",
      example: "Kupno mieszkania za 300k, remont za 50k, sprzedaż za 400k = 50k zysku.",
      category: "Strategie"
    }
  ]
};

const categoryIcons = {
  gielda: TrendingUp,
  krypto: Coins,
  nieruchomosci: Building
};

const GlossarySection = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filterTerms = (terms: any[]) => {
    return terms.filter(term => 
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <section id="glossary" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-financial-navy/10 text-financial-navy border-financial-navy/20">
            📖 Słowniczek Inwestycyjny
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-financial-navy">
            Zrozum Język Finansów
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Poznaj znaczenie najważniejszych pojęć używanych w świecie inwestycji.
            Każde hasło zawiera definicję, praktyczny przykład i kontekst użycia.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Wyszukaj pojęcie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="gielda" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="gielda" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Giełda</span>
              </TabsTrigger>
              <TabsTrigger value="krypto" className="flex items-center space-x-2">
                <Coins className="w-4 h-4" />
                <span>Krypto</span>
              </TabsTrigger>
              <TabsTrigger value="nieruchomosci" className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>Nieruchomości</span>
              </TabsTrigger>
            </TabsList>

            {Object.entries(glossaryData).map(([category, terms]) => (
              <TabsContent key={category} value={category} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filterTerms(terms).map((item, index) => (
                    <Card key={index} className="hover-scale transition-all duration-300 hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="bg-financial-navy/10 text-financial-navy">
                            {item.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-financial-navy">
                          {item.term}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-gray-700 mb-4 leading-relaxed">
                          {item.definition}
                        </CardDescription>
                        
                        <div className="bg-financial-gold/5 border-l-4 border-financial-gold p-4 rounded-r-lg">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-financial-gold">Przykład:</span> {item.example}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filterTerms(terms).length === 0 && searchTerm && (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-500 mb-2">
                      Nie znaleziono pojęć
                    </h3>
                    <p className="text-gray-400">
                      Spróbuj użyć innego słowa kluczowego lub sprawdź inne kategorie.
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          <div className="text-center mt-12">
            <Card className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-financial-navy/5 to-financial-gold/5 border-financial-navy/20">
              <div className="flex items-center justify-center w-12 h-12 bg-financial-navy rounded-lg mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-financial-navy mb-2">
                Nie znalazłeś czego szukasz?
              </h3>
              <p className="text-gray-600 mb-4">
                Nasz słowniczek zawiera ponad 500 pojęć finansowych. Zaproponuj nowe hasło!
              </p>
              <Button variant="outline" className="border-financial-navy text-financial-navy hover:bg-financial-navy hover:text-white">
                Zaproponuj pojęcie
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlossarySection;
