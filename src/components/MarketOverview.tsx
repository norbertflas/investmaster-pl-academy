
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { TrendingUp, TrendingDown, Search, BarChart3, Globe, RefreshCw } from 'lucide-react';
import { alphaVantageService } from '@/services/alphaVantageService';
import { useToast } from '@/hooks/use-toast';

const MarketOverview = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);
  const [sectorData, setSectorData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const [topGainersLosers, sectorPerformance] = await Promise.all([
        alphaVantageService.getTopGainersLosers(),
        alphaVantageService.getSectorPerformance()
      ]);

      setMarketData(topGainersLosers);
      setSectorData(sectorPerformance);

      toast({
        title: "Dane załadowane",
        description: "Przegląd rynku został zaktualizowany",
      });
    } catch (error) {
      console.error('Error loading market data:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać danych rynkowych",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const searchSymbols = async () => {
    if (!searchTerm.trim()) return;
    
    setSearching(true);
    try {
      const results = await alphaVantageService.searchSymbols(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching symbols:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się wyszukać symboli",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    loadMarketData();
  }, []);

  const formatPercentage = (value: string) => {
    const num = parseFloat(value.replace('%', ''));
    return num;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Przegląd Rynku
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Aktualne trendy i najlepsze/najgorsze akcje
          </p>
        </div>
        <Button onClick={loadMarketData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Odśwież
        </Button>
      </div>

      {/* Symbol Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Wyszukaj Akcje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Wpisz nazwę spółki lub symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchSymbols()}
              className="flex-1"
            />
            <Button onClick={searchSymbols} disabled={searching}>
              {searching ? 'Szukam...' : 'Szukaj'}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Wyniki wyszukiwania:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {searchResults.slice(0, 10).map((result, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{result['1. symbol']}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {result['2. name']}
                        </p>
                        <p className="text-xs text-gray-500">
                          {result['4. region']} • {result['8. currency']}
                        </p>
                      </div>
                      <Badge variant="outline">{result['3. type']}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Performance */}
      {marketData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Gainers */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-green-200">
                <TrendingUp className="w-5 h-5 mr-2" />
                Największe Wzrosty
              </CardTitle>
              <CardDescription>Akcje z najwyższymi wzrostami dzisiaj</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.top_gainers?.slice(0, 10).map((stock: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="flex-1">
                      <p className="font-medium">{stock.ticker}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">${parseFloat(stock.price).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        +{stock.change_amount}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        +{formatPercentage(stock.change_percentage).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Losers */}
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800 dark:text-red-200">
                <TrendingDown className="w-5 h-5 mr-2" />
                Największe Spadki
              </CardTitle>
              <CardDescription>Akcje z najwyższymi spadkami dzisiaj</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.top_losers?.slice(0, 10).map((stock: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="flex-1">
                      <p className="font-medium">{stock.ticker}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">${parseFloat(stock.price).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600 dark:text-red-400 font-medium">
                        {stock.change_amount}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {formatPercentage(stock.change_percentage).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Active */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                <BarChart3 className="w-5 h-5 mr-2" />
                Najbardziej Aktywne
              </CardTitle>
              <CardDescription>Akcje o największym obrocie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.most_actively_traded?.slice(0, 10).map((stock: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="flex-1">
                      <p className="font-medium">{stock.ticker}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">${parseFloat(stock.price).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${formatPercentage(stock.change_percentage) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stock.change_amount}
                      </p>
                      <p className="text-xs text-gray-500">
                        Vol: {parseInt(stock.volume).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sector Performance */}
      {sectorData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Wyniki Sektorów
            </CardTitle>
            <CardDescription>Wydajność sektorów w różnych przedziałach czasowych</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Dzisiaj</h4>
                <div className="space-y-2">
                  {sectorData['Rank A: Real-Time Performance'] && Object.entries(sectorData['Rank A: Real-Time Performance']).map(([sector, performance]: [string, any]) => (
                    <div key={sector} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">{sector}</span>
                      <Badge variant={formatPercentage(performance) >= 0 ? "default" : "destructive"}>
                        {formatPercentage(performance).toFixed(2)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">1 Dzień</h4>
                <div className="space-y-2">
                  {sectorData['Rank B: 1 Day Performance'] && Object.entries(sectorData['Rank B: 1 Day Performance']).map(([sector, performance]: [string, any]) => (
                    <div key={sector} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">{sector}</span>
                      <Badge variant={formatPercentage(performance) >= 0 ? "default" : "destructive"}>
                        {formatPercentage(performance).toFixed(2)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">5 Dni</h4>
                <div className="space-y-2">
                  {sectorData['Rank C: 5 Day Performance'] && Object.entries(sectorData['Rank C: 5 Day Performance']).map(([sector, performance]: [string, any]) => (
                    <div key={sector} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">{sector}</span>
                      <Badge variant={formatPercentage(performance) >= 0 ? "default" : "destructive"}>
                        {formatPercentage(performance).toFixed(2)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketOverview;
