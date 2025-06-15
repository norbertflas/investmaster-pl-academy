
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, Building, Calculator, Search } from 'lucide-react';
import { alphaVantageService } from '@/services/alphaVantageService';
import { useToast } from '@/hooks/use-toast';

const FundamentalAnalysis = () => {
  const { toast } = useToast();
  const [symbol, setSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [balanceData, setBalanceData] = useState<any[]>([]);
  const [earningsData, setEarningsData] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);

  const loadFundamentalData = async (stockSymbol: string) => {
    setLoading(true);
    try {
      const [income, balance, earnings, companyOverview] = await Promise.all([
        alphaVantageService.getIncomeStatement(stockSymbol),
        alphaVantageService.getBalanceSheet(stockSymbol),
        alphaVantageService.getEarnings(stockSymbol),
        // Wykorzystamy istniejący serwis dla company info
        import('@/services/marketData').then(module => module.marketDataService.getCompanyInfo(stockSymbol))
      ]);

      setIncomeData(income);
      setBalanceData(balance);
      setEarningsData(earnings);
      setOverview(companyOverview);

      toast({
        title: "Dane załadowane",
        description: `Analiza fundamentalna dla ${stockSymbol} została pobrana`,
      });
    } catch (error) {
      console.error('Error loading fundamental data:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać danych analizy fundamentalnej",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFundamentalData(symbol);
  }, []);

  const handleSearch = () => {
    if (symbol.trim()) {
      loadFundamentalData(symbol.toUpperCase());
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Symbol akcji (np. AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Company Overview */}
      {overview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              {overview.name}
            </CardTitle>
            <CardDescription>{overview.symbol} • {overview.sector} • {overview.industry}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-600 dark:text-blue-400">Kapitalizacja</p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(overview.marketCap)}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Calculator className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-600 dark:text-green-400">P/E Ratio</p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                  {overview.pe?.toFixed(2) || 'N/A'}
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-600 dark:text-purple-400">Beta</p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  {overview.beta?.toFixed(2) || 'N/A'}
                </p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-orange-600 dark:text-orange-400">Dywidenda</p>
                <p className="text-xl font-bold text-orange-900 dark:text-orange-100">
                  {overview.dividendYield ? `${(overview.dividendYield * 100).toFixed(2)}%` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {overview.description?.substring(0, 300)}...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue and Profit */}
        {incomeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Przychody i Zysk Netto</CardTitle>
              <CardDescription>Roczne wyniki finansowe (ostatnie 5 lat)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeData.reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fiscalDateEnding" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="totalRevenue" fill="#2563eb" name="Przychody" />
                    <Bar dataKey="netIncome" fill="#10b981" name="Zysk Netto" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Balance Sheet */}
        {balanceData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Bilans</CardTitle>
              <CardDescription>Aktywa, pasywa i kapitał własny</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={balanceData.reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fiscalDateEnding" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="totalAssets" fill="#8b5cf6" name="Aktywa" />
                    <Bar dataKey="totalLiabilities" fill="#ef4444" name="Zobowiązania" />
                    <Bar dataKey="totalShareholderEquity" fill="#f59e0b" name="Kapitał Własny" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Earnings */}
      {earningsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Zyski Kwartalne</CardTitle>
            <CardDescription>Raportowane vs. szacowane EPS (ostatnie 8 kwartałów)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData.reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fiscalDateEnding" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="reportedEPS" stroke="#2563eb" strokeWidth={2} name="Raportowane EPS" />
                  <Line type="monotone" dataKey="estimatedEPS" stroke="#ef4444" strokeWidth={2} name="Szacowane EPS" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Ratios Summary */}
      {incomeData.length > 0 && balanceData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rentowność</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>ROE:</span>
                  <span className="font-bold">
                    {balanceData[0] && incomeData[0] ? 
                      ((incomeData[0].netIncome / balanceData[0].totalShareholderEquity) * 100).toFixed(2) + '%' : 
                      'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Marża Netto:</span>
                  <span className="font-bold">
                    {incomeData[0] ? 
                      ((incomeData[0].netIncome / incomeData[0].totalRevenue) * 100).toFixed(2) + '%' : 
                      'N/A'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zadłużenie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Debt/Equity:</span>
                  <span className="font-bold">
                    {balanceData[0] ? 
                      (balanceData[0].totalLiabilities / balanceData[0].totalShareholderEquity).toFixed(2) : 
                      'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Debt/Assets:</span>
                  <span className="font-bold">
                    {balanceData[0] ? 
                      ((balanceData[0].totalLiabilities / balanceData[0].totalAssets) * 100).toFixed(2) + '%' : 
                      'N/A'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wzrost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Wzrost przychodów:</span>
                  <span className="font-bold">
                    {incomeData.length >= 2 ? 
                      (((incomeData[0].totalRevenue - incomeData[1].totalRevenue) / incomeData[1].totalRevenue) * 100).toFixed(2) + '%' : 
                      'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Wzrost zysku:</span>
                  <span className="font-bold">
                    {incomeData.length >= 2 ? 
                      (((incomeData[0].netIncome - incomeData[1].netIncome) / incomeData[1].netIncome) * 100).toFixed(2) + '%' : 
                      'N/A'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FundamentalAnalysis;
