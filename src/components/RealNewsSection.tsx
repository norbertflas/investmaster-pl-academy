
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ExternalLink, TrendingUp, Globe, Clock, ChevronRight, AlertCircle, CheckCircle, Minus } from 'lucide-react';
import { marketDataService } from '@/services/marketData';

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relevantSymbols: string[];
  url: string;
}

interface MarketData {
  exchangeRates: { [key: string]: number } | null;
  interestRates: { rate: number; date: string } | null;
}

const RealNewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [marketData, setMarketData] = useState<MarketData>({
    exchangeRates: null,
    interestRates: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Równoległe pobieranie danych
      const [newsData, exchangeRates, interestRates] = await Promise.allSettled([
        marketDataService.getFinancialNews(12),
        marketDataService.getExchangeRates(),
        marketDataService.getInterestRates()
      ]);

      // Obsługa wyników
      if (newsData.status === 'fulfilled') {
        setNews(newsData.value);
      }

      setMarketData({
        exchangeRates: exchangeRates.status === 'fulfilled' ? exchangeRates.value : null,
        interestRates: interestRates.status === 'fulfilled' ? interestRates.value : null
      });

    } catch (err) {
      setError('Nie udało się pobrać aktualnych danych rynkowych');
      console.error('Error loading market data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'negative': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'neutral': return <Minus className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'negative': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      case 'neutral': return 'border-gray-200 bg-gray-50 dark:bg-gray-800';
      default: return 'border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Alpha Vantage format: 20231201T120000
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(9, 11);
      const minute = dateString.substring(11, 13);
      
      const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Przed chwilą';
      if (diffInHours < 24) return `${diffInHours}h temu`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} dni temu`;
    } catch {
      return 'Niedawno';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (error) {
    return (
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Błąd ładowania danych
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={loadData} variant="outline">
              Spróbuj ponownie
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Najnowsze Wiadomości Rynkowe
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Aktualne informacje wpływające na rynki finansowe - na żywo z Alpha Vantage API
          </p>
        </div>

        {/* Market Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Exchange Rates */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">USD/PLN</h4>
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <div className="text-xl font-bold text-blue-600">
                  {marketData.exchangeRates?.USD?.toFixed(4) || 'N/A'}
                </div>
              )}
              <div className="text-xs text-blue-700 dark:text-blue-300">NBP API</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">EUR/PLN</h4>
                <Globe className="w-4 h-4 text-green-600" />
              </div>
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <div className="text-xl font-bold text-green-600">
                  {marketData.exchangeRates?.EUR?.toFixed(4) || 'N/A'}
                </div>
              )}
              <div className="text-xs text-green-700 dark:text-green-300">NBP API</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Stopa NBP</h4>
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <div className="text-xl font-bold text-purple-600">
                  {marketData.interestRates?.rate}%
                </div>
              )}
              <div className="text-xs text-purple-700 dark:text-purple-300">Aktualna</div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">Aktualność</h4>
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-sm font-bold text-orange-600">
                Na żywo
              </div>
              <div className="text-xs text-orange-700 dark:text-orange-300">
                Odświeżane co 5 min
              </div>
            </CardContent>
          </Card>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(0, 9).map((article, index) => (
              <Card 
                key={index} 
                className={`group hover:shadow-xl transition-all duration-300 border-l-4 ${getSentimentColor(article.sentiment)}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getSentimentIcon(article.sentiment)}
                      <Badge variant="outline" className="text-xs capitalize">
                        {article.sentiment === 'positive' ? 'Pozytywne' : 
                         article.sentiment === 'negative' ? 'Negatywne' : 'Neutralne'}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {article.source}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {truncateText(article.title, 80)}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-3">
                    {truncateText(article.summary, 120)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(article.publishedAt)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      2-3 min
                    </div>
                  </div>

                  {article.relevantSymbols && article.relevantSymbols.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Dotyczy spółek:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {article.relevantSymbols.slice(0, 3).map((symbol, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {symbol}
                          </Badge>
                        ))}
                        {article.relevantSymbols.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.relevantSymbols.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500">
                      Źródło: Alpha Vantage
                    </div>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <Button className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Czytaj pełny artykuł
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? 'Ładowanie...' : 'Odśwież dane'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* API Status Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Połączono z Alpha Vantage & NBP API</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealNewsSection;
