import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Search, Activity } from 'lucide-react';
import { alphaVantageService } from '@/services/alphaVantageService';
import { useToast } from '@/hooks/use-toast';

const TechnicalAnalysis = () => {
  const { toast } = useToast();
  const [symbol, setSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [rsiData, setRsiData] = useState<any[]>([]);
  const [macdData, setMacdData] = useState<any[]>([]);
  const [smaData, setSmaData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('price');

  const loadTechnicalData = async (stockSymbol: string) => {
    setLoading(true);
    try {
      const [daily, rsi, macd, sma] = await Promise.all([
        alphaVantageService.getDailyPrices(stockSymbol, 'compact'),
        alphaVantageService.getRSI(stockSymbol),
        alphaVantageService.getMACD(stockSymbol),
        alphaVantageService.getSMA(stockSymbol, 'daily', 20)
      ]);

      setHistoricalData(daily.slice(0, 30).reverse());
      setRsiData(rsi.slice(0, 30).reverse());
      setMacdData(macd.slice(0, 30).reverse());
      setSmaData(sma.slice(0, 30).reverse());

      toast({
        title: "Dane załadowane",
        description: `Analiza techniczna dla ${stockSymbol} została pobrana`,
      });
    } catch (error) {
      console.error('Error loading technical data:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać danych analizy technicznej",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTechnicalData(symbol);
  }, []);

  const handleSearch = () => {
    if (symbol.trim()) {
      loadTechnicalData(symbol.toUpperCase());
    }
  };

  const getSignalBadge = (signal?: string) => {
    switch (signal) {
      case 'BUY':
        return <Badge className="bg-green-500">KUP</Badge>;
      case 'SELL':
        return <Badge className="bg-red-500">SPRZEDAJ</Badge>;
      case 'HOLD':
        return <Badge variant="outline">TRZYMAJ</Badge>;
      default:
        return <Badge variant="secondary">BRAK</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Symbol akcji (np. AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Ceny</SelectItem>
            <SelectItem value="rsi">RSI</SelectItem>
            <SelectItem value="macd">MACD</SelectItem>
            <SelectItem value="sma">SMA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Stats */}
      {historicalData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Ostatnia Cena</p>
                  <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                    ${historicalData[historicalData.length - 1]?.close.toFixed(2)}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Najwyższa (30d)</p>
                  <p className="text-xl font-bold text-green-900 dark:text-green-100">
                    ${Math.max(...historicalData.map(d => d.high)).toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400">Najniższa (30d)</p>
                  <p className="text-xl font-bold text-red-900 dark:text-red-100">
                    ${Math.min(...historicalData.map(d => d.low)).toFixed(2)}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">RSI Sygnał</p>
                  <div className="mt-1">
                    {rsiData.length > 0 && getSignalBadge(rsiData[rsiData.length - 1]?.signal)}
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {activeTab === 'price' && 'Wykres Cen'}
            {activeTab === 'rsi' && 'RSI (Relative Strength Index)'}
            {activeTab === 'macd' && 'MACD'}
            {activeTab === 'sma' && 'Średnia Krocząca (SMA 20)'}
          </CardTitle>
          <CardDescription>
            {activeTab === 'price' && 'Ceny otwarcia, maksymalne, minimalne i zamknięcia'}
            {activeTab === 'rsi' && 'Wskaźnik siły względnej (overbought > 70, oversold < 30)'}
            {activeTab === 'macd' && 'Moving Average Convergence Divergence'}
            {activeTab === 'sma' && 'Średnia krocząca z 20 okresów'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'price' && (
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="close" stroke="#2563eb" strokeWidth={2} />
                  <Line type="monotone" dataKey="high" stroke="#10b981" strokeWidth={1} />
                  <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={1} />
                </LineChart>
              )}
              
              {activeTab === 'rsi' && (
                <LineChart data={rsiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              )}
              
              {activeTab === 'macd' && (
                <ComposedChart data={macdData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="macd" stroke="#2563eb" strokeWidth={2} />
                  <Line type="monotone" dataKey="signal" stroke="#ef4444" strokeWidth={2} />
                  <Bar dataKey="histogram" fill="#10b981" />
                </ComposedChart>
              )}
              
              {activeTab === 'sma' && (
                <LineChart data={smaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Technical Analysis Summary */}
      {rsiData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">RSI Analiza</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Obecny RSI:</span>
                  <span className="font-bold">{rsiData[rsiData.length - 1]?.value.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sygnał:</span>
                  {getSignalBadge(rsiData[rsiData.length - 1]?.signal)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {rsiData[rsiData.length - 1]?.value > 70 ? 
                    'Akcja może być wyprzedana (rozważ sprzedaż)' :
                    rsiData[rsiData.length - 1]?.value < 30 ?
                    'Akcja może być niedowartościowana (rozważ kupno)' :
                    'Akcja w neutralnej strefie'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">MACD Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>MACD:</span>
                  <span className="font-bold">{macdData[macdData.length - 1]?.macd.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Signal:</span>
                  <span className="font-bold">{macdData[macdData.length - 1]?.signal.toFixed(4)}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {macdData[macdData.length - 1]?.macd > macdData[macdData.length - 1]?.signal ?
                    'Sygnał upatrzony (bullish trend)' :
                    'Sygnał spadkowy (bearish trend)'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Średnia Krocząca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>SMA 20:</span>
                  <span className="font-bold">${smaData[smaData.length - 1]?.value.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cena:</span>
                  <span className="font-bold">${historicalData[historicalData.length - 1]?.close.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {historicalData[historicalData.length - 1]?.close > smaData[smaData.length - 1]?.value ?
                    'Cena powyżej średniej (trend wzrostowy)' :
                    'Cena poniżej średniej (trend spadkowy)'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TechnicalAnalysis;
