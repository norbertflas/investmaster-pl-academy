
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, TrendingUp, Globe, Clock, ChevronRight } from 'lucide-react';

const NewsSection = () => {
  const [news] = useState([
    {
      id: 1,
      title: "NBP podwyższa stopy procentowe o 0.25 pkt bazowych",
      description: "Rada Polityki Pieniężnej zdecydowała o dalszym zacieśnieniu polityki monetarnej w odpowiedzi na rosnącą inflację",
      category: "Polityka monetarna",
      source: "NBP",
      publishedAt: "2024-01-15T10:30:00Z",
      impact: "high",
      markets: ["PLN", "Obligacje", "Banki"],
      readTime: "3 min"
    },
    {
      id: 2,
      title: "GPW wprowadza nowe zasady ESG dla spółek",
      description: "Giełda Papierów Wartościowych w Warszawie ogłosiła nowe wymogi raportowania ESG dla spółek z głównego rynku",
      category: "Regulacje",
      source: "GPW",
      publishedAt: "2024-01-15T08:15:00Z",
      impact: "medium",
      markets: ["WIG", "ESG"],
      readTime: "5 min"
    },
    {
      id: 3,
      title: "Rekordowe wyniki CD Projekt za Q4 2023",
      description: "Polska spółka gamingowa przekroczyła oczekiwania analityków dzięki silnej sprzedaży Cyberpunk 2077",
      category: "Wyniki spółek",
      source: "CD Projekt",
      publishedAt: "2024-01-14T16:45:00Z",
      impact: "medium",
      markets: ["CDR", "Gaming"],
      readTime: "4 min"
    },
    {
      id: 4,
      title: "Fed sygnalizuje możliwe obniżki stóp w 2024",
      description: "Prezes Jerome Powell wskazał na możliwość trzech obniżek stóp procentowych w ciągu roku",
      category: "Polityka monetarna",
      source: "Federal Reserve",
      publishedAt: "2024-01-14T14:20:00Z",
      impact: "high",
      markets: ["USD", "S&P 500", "Tech"],
      readTime: "6 min"
    },
    {
      id: 5,
      title: "Orlen finalizuje przejęcie aktywów energetycznych",
      description: "PKN Orlen zakończył strategiczne przejęcie, które wzmocni pozycję w sektorze energetycznym",
      category: "M&A",
      source: "PKN Orlen",
      publishedAt: "2024-01-14T12:00:00Z",
      impact: "medium",
      markets: ["PKN", "Energia"],
      readTime: "4 min"
    },
    {
      id: 6,
      title: "Komisja Europejska proponuje nowe regulacje AI",
      description: "Nowe przepisy mogą wpłynąć na spółki technologiczne działające w UE",
      category: "Regulacje",
      source: "Komisja Europejska",
      publishedAt: "2024-01-13T11:30:00Z",
      impact: "high",
      markets: ["Tech", "AI"],
      readTime: "7 min"
    }
  ]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h temu`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} dni temu`;
    }
  };

  return (
    <section id="news" className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Najnowsze Wiadomości Rynkowe
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Bądź na bieżąco z najważniejszymi wydarzeniami wpływającymi na rynki finansowe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article) => (
            <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {article.category}
                  </Badge>
                  <Badge variant="outline" className={getImpactColor(article.impact)}>
                    {article.impact === 'high' ? 'Wysoki wpływ' : 
                     article.impact === 'medium' ? 'Średni wpływ' : 'Niski wpływ'}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {article.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    {article.source}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(article.publishedAt)}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Dotknięte rynki:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {article.markets.slice(0, 3).map((market, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {market}
                      </Badge>
                    ))}
                    {article.markets.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.markets.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime}
                  </div>
                  <Button variant="ghost" className="p-2 h-auto">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                <Button className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  Czytaj więcej
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Zobacz wszystkie wiadomości
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
