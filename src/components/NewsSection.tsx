
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Clock, ExternalLink, Globe } from 'lucide-react';

const newsData = {
  polska: [
    {
      id: 1,
      title: "GPW notuje rekordowe obroty w sektorze technologicznym",
      excerpt: "Sektor technologiczny na Giełdzie Papierów Wartościowych w Warszawie osiągnął rekordowe obroty...",
      source: "PAP Biznes",
      time: "2 godziny temu",
      trend: "up",
      category: "Giełda"
    },
    {
      id: 2,
      title: "NBP utrzymuje stopy procentowe bez zmian",
      excerpt: "Rada Polityki Pieniężnej podjęła decyzję o pozostawieniu głównej stopy procentowej na poziomie 5,75%...",
      source: "Bankier.pl",
      time: "4 godziny temu",
      trend: "neutral",
      category: "Polityka Monetarna"
    },
    {
      id: 3,
      title: "Polski złoty umacnia się względem głównych walut",
      excerpt: "Kurs złotego względem euro i dolara amerykańskiego wykazuje tendencję wzrostową...",
      source: "Money.pl",
      time: "6 godzin temu",
      trend: "up",
      category: "Waluty"
    }
  ],
  swiat: [
    {
      id: 4,
      title: "Fed sygnalizuje możliwość obniżek stóp procentowych",
      excerpt: "Rezerwa Federalna USA wskazuje na możliwość obniżenia stóp procentowych w nadchodzących miesiącach...",
      source: "Reuters",
      time: "1 godzina temu",
      trend: "down",
      category: "Fed"
    },
    {
      id: 5,
      title: "Bitcoin przekracza poziom 45,000 USD",
      excerpt: "Kryptowaluta Bitcoin odnotowuje znaczący wzrost, przekraczając psychologiczną barierę 45,000 dolarów...",
      source: "CoinDesk",
      time: "3 godziny temu",
      trend: "up",
      category: "Krypto"
    },
    {
      id: 6,
      title: "Ceny ropy naftowej stabilizują się po wczorajszych spadkach",
      excerpt: "Rynek ropy naftowej wykazuje oznaki stabilizacji po ostrych spadkach z poprzedniego dnia...",
      source: "Bloomberg",
      time: "5 godzin temu",
      trend: "neutral",
      category: "Surowce"
    }
  ]
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    case "down":
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    default:
      return <Globe className="w-4 h-4 text-gray-500" />;
  }
};

const getCategoryColor = (category: string) => {
  const colors = {
    "Giełda": "bg-blue-100 text-blue-800",
    "Polityka Monetarna": "bg-purple-100 text-purple-800",
    "Waluty": "bg-green-100 text-green-800",
    "Fed": "bg-red-100 text-red-800",
    "Krypto": "bg-yellow-100 text-yellow-800",
    "Surowce": "bg-orange-100 text-orange-800"
  };
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const NewsCard = ({ news }: { news: any }) => (
  <Card className="hover-scale transition-all duration-300 hover:shadow-md">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between mb-2">
        <Badge variant="outline" className={getCategoryColor(news.category)}>
          {news.category}
        </Badge>
        {getTrendIcon(news.trend)}
      </div>
      <CardTitle className="text-lg leading-tight hover:text-financial-navy transition-colors cursor-pointer">
        {news.title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <CardDescription className="text-gray-600 mb-4 line-clamp-2">
        {news.excerpt}
      </CardDescription>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <span>{news.source}</span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{news.time}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-auto p-1">
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const NewsSection = () => {
  return (
    <section id="news" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-financial-gold/10 text-financial-gold border-financial-gold/20">
            📰 Wiadomości Rynkowe
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-financial-navy">
            Bądź na Bieżąco z Rynkiem
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Śledź najważniejsze wydarzenia na polskim i światowym rynku finansowym.
            Ucz się interpretować wiadomości i ich wpływ na inwestycje.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="polska" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="polska" className="flex items-center space-x-2">
                <span>🇵🇱</span>
                <span>Polska</span>
              </TabsTrigger>
              <TabsTrigger value="swiat" className="flex items-center space-x-2">
                <span>🌍</span>
                <span>Świat</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="polska" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsData.polska.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="swiat" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsData.swiat.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-financial-navy text-financial-navy hover:bg-financial-navy hover:text-white">
              Zobacz Wszystkie Wiadomości
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
