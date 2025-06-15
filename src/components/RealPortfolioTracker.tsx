import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Plus, Trash2, RefreshCw, Activity, BarChart3, Calculator } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { marketDataService } from '@/services/marketData';
import { alphaVantageService } from '@/services/alphaVantageService';
import { useToast } from '@/hooks/use-toast';
import TechnicalAnalysis from './TechnicalAnalysis';
import FundamentalAnalysis from './FundamentalAnalysis';
import MarketOverview from './MarketOverview';

interface Position {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice?: number;
  marketValue?: number;
  totalReturn?: number;
  totalReturnPercent?: number;
  dayChange?: number;
  dayChangePercent?: number;
  sector?: string;
}

interface Portfolio {
  id: string;
  name: string;
  cash: number;
  positions: Position[];
  totalValue?: number;
  totalReturn?: number;
  totalReturnPercent?: number;
}

const RealPortfolioTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newPosition, setNewPosition] = useState({
    symbol: '',
    quantity: '',
    avgPrice: ''
  });
  const [addingPosition, setAddingPosition] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio');

  useEffect(() => {
    if (user) {
      loadPortfolios();
    }
  }, [user]);

  const loadPortfolios = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_portfolios')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const portfoliosWithPrices = await Promise.all(
          data.map(async (portfolio) => {
            // Safely parse positions from JSON with proper type conversion
            const positions: Position[] = Array.isArray(portfolio.positions) 
              ? (portfolio.positions as unknown as Position[])
              : [];
            
            const positionsWithPrices = await updatePositionPrices(positions);
            
            const totalValue = calculatePortfolioValue(positionsWithPrices, portfolio.cash);
            const totalReturn = calculateTotalReturn(positionsWithPrices);
            
            return {
              ...portfolio,
              positions: positionsWithPrices,
              totalValue,
              totalReturn,
              totalReturnPercent: totalReturn / (totalValue - totalReturn) * 100
            };
          })
        );

        setPortfolios(portfoliosWithPrices);
        if (!activePortfolio && portfoliosWithPrices.length > 0) {
          setActivePortfolio(portfoliosWithPrices[0]);
        }
      } else {
        // Create default portfolio
        await createDefaultPortfolio();
      }
    } catch (error) {
      console.error('Error loading portfolios:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować portfeli",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPortfolio = async () => {
    if (!user) return;

    const defaultPositions: Position[] = [
      {
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 10,
        avgPrice: 150.0,
        sector: 'Technology'
      },
      {
        id: '2',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        quantity: 5,
        avgPrice: 300.0,
        sector: 'Technology'
      },
      {
        id: '3',
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF Trust',
        quantity: 20,
        avgPrice: 400.0,
        sector: 'ETF'
      }
    ];

    try {
      const { data, error } = await supabase
        .from('user_portfolios')
        .insert({
          user_id: user.id,
          name: 'Demo Portfolio',
          cash: 5000,
          positions: defaultPositions as any // Type assertion for JSON storage
        })
        .select()
        .single();

      if (error) throw error;

      await loadPortfolios();
    } catch (error) {
      console.error('Error creating default portfolio:', error);
    }
  };

  const updatePositionPrices = async (positions: Position[]): Promise<Position[]> => {
    return Promise.all(
      positions.map(async (position) => {
        try {
          const stockData = await marketDataService.getUSStockPrice(position.symbol);
          if (stockData) {
            const marketValue = position.quantity * stockData.price;
            const totalReturn = marketValue - (position.quantity * position.avgPrice);
            const totalReturnPercent = (totalReturn / (position.quantity * position.avgPrice)) * 100;

            return {
              ...position,
              currentPrice: stockData.price,
              marketValue,
              totalReturn,
              totalReturnPercent,
              dayChange: stockData.change,
              dayChangePercent: stockData.changePercent
            };
          }
        } catch (error) {
          console.error(`Error fetching price for ${position.symbol}:`, error);
        }
        
        return {
          ...position,
          currentPrice: position.avgPrice,
          marketValue: position.quantity * position.avgPrice,
          totalReturn: 0,
          totalReturnPercent: 0
        };
      })
    );
  };

  const calculatePortfolioValue = (positions: Position[], cash: number): number => {
    const positionsValue = positions.reduce((sum, pos) => sum + (pos.marketValue || 0), 0);
    return positionsValue + cash;
  };

  const calculateTotalReturn = (positions: Position[]): number => {
    return positions.reduce((sum, pos) => sum + (pos.totalReturn || 0), 0);
  };

  const refreshPrices = async () => {
    if (!activePortfolio) return;
    
    setRefreshing(true);
    try {
      const updatedPositions = await updatePositionPrices(activePortfolio.positions);
      const totalValue = calculatePortfolioValue(updatedPositions, activePortfolio.cash);
      const totalReturn = calculateTotalReturn(updatedPositions);
      
      const updatedPortfolio = {
        ...activePortfolio,
        positions: updatedPositions,
        totalValue,
        totalReturn,
        totalReturnPercent: totalReturn / (totalValue - totalReturn) * 100
      };

      setActivePortfolio(updatedPortfolio);
      
      // Update in database
      await supabase
        .from('user_portfolios')
        .update({ 
          positions: updatedPositions as any, // Type assertion for JSON storage
          updated_at: new Date().toISOString()
        })
        .eq('id', activePortfolio.id);

      toast({
        title: "Zaktualizowano",
        description: "Ceny zostały odświeżone",
      });
    } catch (error) {
      console.error('Error refreshing prices:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się odświeżyć cen",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const addPosition = async () => {
    if (!activePortfolio || !newPosition.symbol || !newPosition.quantity || !newPosition.avgPrice) {
      return;
    }

    setAddingPosition(true);
    try {
      // Get company info
      const stockData = await marketDataService.getUSStockPrice(newPosition.symbol.toUpperCase());
      const companyInfo = await marketDataService.getCompanyInfo(newPosition.symbol.toUpperCase());
      
      if (!stockData) {
        toast({
          title: "Błąd",
          description: "Nie znaleziono symbolu akcji",
          variant: "destructive"
        });
        return;
      }

      const position: Position = {
        id: Date.now().toString(),
        symbol: newPosition.symbol.toUpperCase(),
        name: companyInfo?.name || newPosition.symbol.toUpperCase(),
        quantity: parseFloat(newPosition.quantity),
        avgPrice: parseFloat(newPosition.avgPrice),
        sector: companyInfo?.sector || 'Unknown'
      };

      const updatedPositions = [...activePortfolio.positions, position];
      const positionsWithPrices = await updatePositionPrices(updatedPositions);
      
      const updatedPortfolio = {
        ...activePortfolio,
        positions: positionsWithPrices
      };

      // Update in database
      await supabase
        .from('user_portfolios')
        .update({ 
          positions: positionsWithPrices as any, // Type assertion for JSON storage
          updated_at: new Date().toISOString()
        })
        .eq('id', activePortfolio.id);

      setActivePortfolio(updatedPortfolio);
      setNewPosition({ symbol: '', quantity: '', avgPrice: '' });
      
      toast({
        title: "Dodano pozycję",
        description: `${position.symbol} został dodany do portfela`,
      });
    } catch (error) {
      console.error('Error adding position:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się dodać pozycji",
        variant: "destructive"
      });
    } finally {
      setAddingPosition(false);
    }
  };

  const removePosition = async (positionId: string) => {
    if (!activePortfolio) return;

    try {
      const updatedPositions = activePortfolio.positions.filter(pos => pos.id !== positionId);
      
      await supabase
        .from('user_portfolios')
        .update({ 
          positions: updatedPositions as any, // Type assertion for JSON storage
          updated_at: new Date().toISOString()
        })
        .eq('id', activePortfolio.id);

      setActivePortfolio({
        ...activePortfolio,
        positions: updatedPositions
      });

      toast({
        title: "Usunięto pozycję",
        description: "Pozycja została usunięta z portfela",
      });
    } catch (error) {
      console.error('Error removing position:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć pozycji",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Zaloguj się, aby śledzić portfel</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Funkcja portfolio trackera jest dostępna tylko dla zalogowanych użytkowników.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Portfolio Tracker
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Kompleksowe narzędzie analizy inwestycyjnej
          </p>
        </div>
        <Button onClick={refreshPrices} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Odśwież ceny
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio" className="flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            Portfel
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analiza Techniczna
          </TabsTrigger>
          <TabsTrigger value="fundamental" className="flex items-center">
            <Calculator className="w-4 h-4 mr-2" />
            Analiza Fundamentalna
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Przegląd Rynku
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6">
          {activePortfolio && (
            <>
              {/* Portfolio Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Wartość Portfela
                        </p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          ${activePortfolio.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${activePortfolio.totalReturn && activePortfolio.totalReturn >= 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : 'bg-red-50 dark:bg-red-900/20 border-red-200'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${activePortfolio.totalReturn && activePortfolio.totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          Zysk/Strata
                        </p>
                        <p className={`text-2xl font-bold ${activePortfolio.totalReturn && activePortfolio.totalReturn >= 0 ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
                          ${activePortfolio.totalReturn?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      {activePortfolio.totalReturn && activePortfolio.totalReturn >= 0 ? (
                        <TrendingUp className="w-8 h-8 text-green-600" />
                      ) : (
                        <TrendingDown className="w-8 h-8 text-red-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          Gotówka
                        </p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          ${activePortfolio.cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <PieChart className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                          Pozycje
                        </p>
                        <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                          {activePortfolio.positions.length}
                        </p>
                      </div>
                      <Activity className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Add Position Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Dodaj Nową Pozycję
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      placeholder="Symbol (np. AAPL)"
                      value={newPosition.symbol}
                      onChange={(e) => setNewPosition({ ...newPosition, symbol: e.target.value.toUpperCase() })}
                    />
                    <Input
                      type="number"
                      placeholder="Ilość"
                      value={newPosition.quantity}
                      onChange={(e) => setNewPosition({ ...newPosition, quantity: e.target.value })}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Średnia cena"
                      value={newPosition.avgPrice}
                      onChange={(e) => setNewPosition({ ...newPosition, avgPrice: e.target.value })}
                    />
                    <Button onClick={addPosition} disabled={addingPosition}>
                      {addingPosition ? 'Dodawanie...' : 'Dodaj Pozycję'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Positions Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Pozycje w Portfelu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Symbol</th>
                          <th className="text-left p-2">Nazwa</th>
                          <th className="text-right p-2">Ilość</th>
                          <th className="text-right p-2">Śr. Cena</th>
                          <th className="text-right p-2">Bieżąca Cena</th>
                          <th className="text-right p-2">Wartość Rynkowa</th>
                          <th className="text-right p-2">Zysk/Strata</th>
                          <th className="text-right p-2">%</th>
                          <th className="text-right p-2">Akcje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activePortfolio.positions.map((position) => (
                          <tr key={position.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-2 font-medium">{position.symbol}</td>
                            <td className="p-2 text-sm text-gray-600 dark:text-gray-400">
                              {position.name}
                            </td>
                            <td className="p-2 text-right">{position.quantity}</td>
                            <td className="p-2 text-right">
                              ${position.avgPrice.toFixed(2)}
                            </td>
                            <td className="p-2 text-right">
                              ${position.currentPrice?.toFixed(2)}
                              {position.dayChangePercent && (
                                <div className={`text-xs ${position.dayChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {position.dayChangePercent >= 0 ? '+' : ''}{position.dayChangePercent.toFixed(2)}%
                                </div>
                              )}
                            </td>
                            <td className="p-2 text-right">
                              ${position.marketValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className={`p-2 text-right ${position.totalReturn && position.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${position.totalReturn?.toFixed(2)}
                            </td>
                            <td className={`p-2 text-right ${position.totalReturnPercent && position.totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {position.totalReturnPercent?.toFixed(2)}%
                            </td>
                            <td className="p-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removePosition(position.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="technical">
          <TechnicalAnalysis />
        </TabsContent>

        <TabsContent value="fundamental">
          <FundamentalAnalysis />
        </TabsContent>

        <TabsContent value="market">
          <MarketOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealPortfolioTracker;
