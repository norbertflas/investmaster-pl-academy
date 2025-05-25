
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart3, Calculator, AlertTriangle, CheckCircle } from 'lucide-react';

const AnalysisTools = () => {
  // Analiza portfela
  const [portfolioData, setPortfolioData] = useState([
    { name: 'Akcje', value: 60, amount: 60000 },
    { name: 'Obligacje', value: 25, amount: 25000 },
    { name: 'ETF', value: 10, amount: 10000 },
    { name: 'Gotówka', value: 5, amount: 5000 }
  ]);

  // Analiza wskaźników
  const [financialData, setFinancialData] = useState({
    revenue: '1000000',
    netIncome: '150000',
    totalAssets: '800000',
    totalEquity: '500000',
    currentAssets: '300000',
    currentLiabilities: '150000',
    totalDebt: '200000'
  });

  // Analiza ryzyka
  const [riskData, setRiskData] = useState({
    volatility: '15',
    beta: '1.2',
    sharpeRatio: '0.8'
  });

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

  const calculateFinancialRatios = () => {
    const revenue = parseFloat(financialData.revenue) || 0;
    const netIncome = parseFloat(financialData.netIncome) || 0;
    const totalAssets = parseFloat(financialData.totalAssets) || 0;
    const totalEquity = parseFloat(financialData.totalEquity) || 0;
    const currentAssets = parseFloat(financialData.currentAssets) || 0;
    const currentLiabilities = parseFloat(financialData.currentLiabilities) || 0;
    const totalDebt = parseFloat(financialData.totalDebt) || 0;

    return {
      profitMargin: revenue !== 0 ? (netIncome / revenue) * 100 : 0,
      roa: totalAssets !== 0 ? (netIncome / totalAssets) * 100 : 0,
      roe: totalEquity !== 0 ? (netIncome / totalEquity) * 100 : 0,
      currentRatio: currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0,
      debtToEquity: totalEquity !== 0 ? totalDebt / totalEquity : 0
    };
  };

  const ratios = calculateFinancialRatios();

  const getRatioStatus = (ratio: string, value: number) => {
    switch (ratio) {
      case 'profitMargin':
        return value >= 10 ? 'good' : value >= 5 ? 'average' : 'poor';
      case 'roa':
        return value >= 15 ? 'good' : value >= 8 ? 'average' : 'poor';
      case 'roe':
        return value >= 20 ? 'good' : value >= 12 ? 'average' : 'poor';
      case 'currentRatio':
        return value >= 2 ? 'good' : value >= 1.5 ? 'average' : 'poor';
      case 'debtToEquity':
        return value <= 0.3 ? 'good' : value <= 0.6 ? 'average' : 'poor';
      default:
        return 'average';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 dark:text-green-400';
      case 'average': return 'text-yellow-600 dark:text-yellow-400';
      case 'poor': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'average': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'poor': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const portfolioTotalValue = portfolioData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Narzędzia Analityczne
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Profesjonalne narzędzia do analizy inwestycji i portfela
        </p>
      </div>

      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="portfolio" className="flex items-center space-x-2">
            <PieIcon className="w-4 h-4" />
            <span>Analiza portfela</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Wskaźniki finansowe</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Analiza ryzyka</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Struktura portfela</CardTitle>
                <CardDescription>
                  Rozkład aktywów w Twoim portfelu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, value}) => `${name}: ${value}%`}
                      >
                        {portfolioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Udział']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Szczegóły portfela</CardTitle>
                <CardDescription>
                  Wartości i proporcje aktywów
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {portfolioTotalValue.toLocaleString('pl-PL')} zł
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Łączna wartość portfela
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {portfolioData.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {item.amount.toLocaleString('pl-PL')} zł
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.value}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">
                      Rekomendacje dywersyfikacji:
                    </h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Optymalna alokacja akcji: 60-70%</li>
                      <li>• Obligacje jako stabilizator: 20-30%</li>
                      <li>• ETF dla dywersyfikacji: 10-15%</li>
                      <li>• Rezerwa gotówkowa: 5-10%</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Dane finansowe</span>
                </CardTitle>
                <CardDescription>
                  Wprowadź podstawowe dane finansowe spółki
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Przychody (zł)</Label>
                    <Input
                      id="revenue"
                      type="number"
                      value={financialData.revenue}
                      onChange={(e) => setFinancialData({...financialData, revenue: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="netIncome">Zysk netto (zł)</Label>
                    <Input
                      id="netIncome"
                      type="number"
                      value={financialData.netIncome}
                      onChange={(e) => setFinancialData({...financialData, netIncome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalAssets">Aktywa ogółem (zł)</Label>
                    <Input
                      id="totalAssets"
                      type="number"
                      value={financialData.totalAssets}
                      onChange={(e) => setFinancialData({...financialData, totalAssets: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalEquity">Kapitał własny (zł)</Label>
                    <Input
                      id="totalEquity"
                      type="number"
                      value={financialData.totalEquity}
                      onChange={(e) => setFinancialData({...financialData, totalEquity: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentAssets">Aktywa obrotowe (zł)</Label>
                    <Input
                      id="currentAssets"
                      type="number"
                      value={financialData.currentAssets}
                      onChange={(e) => setFinancialData({...financialData, currentAssets: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentLiabilities">Zobowiązania krótkoterm. (zł)</Label>
                    <Input
                      id="currentLiabilities"
                      type="number"
                      value={financialData.currentLiabilities}
                      onChange={(e) => setFinancialData({...financialData, currentLiabilities: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wskaźniki finansowe</CardTitle>
                <CardDescription>
                  Automatycznie obliczane wskaźniki
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Marża zysku', value: ratios.profitMargin, suffix: '%', key: 'profitMargin' },
                    { name: 'ROA', value: ratios.roa, suffix: '%', key: 'roa' },
                    { name: 'ROE', value: ratios.roe, suffix: '%', key: 'roe' },
                    { name: 'Wskaźnik płynności', value: ratios.currentRatio, suffix: '', key: 'currentRatio' },
                    { name: 'Dług/Kapitał', value: ratios.debtToEquity, suffix: '', key: 'debtToEquity' }
                  ].map((ratio) => {
                    const status = getRatioStatus(ratio.key, ratio.value);
                    return (
                      <div key={ratio.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(status)}
                          <span className="font-medium">{ratio.name}</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${getStatusColor(status)}`}>
                            {ratio.value.toFixed(2)}{ratio.suffix}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Analiza ryzyka inwestycji</CardTitle>
              <CardDescription>
                Ocena poziomu ryzyka portfela
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="volatility">Zmienność (%)</Label>
                    <Input
                      id="volatility"
                      type="number"
                      value={riskData.volatility}
                      onChange={(e) => setRiskData({...riskData, volatility: e.target.value})}
                      placeholder="15"
                      step="0.1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="beta">Beta</Label>
                    <Input
                      id="beta"
                      type="number"
                      value={riskData.beta}
                      onChange={(e) => setRiskData({...riskData, beta: e.target.value})}
                      placeholder="1.2"
                      step="0.1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sharpeRatio">Wskaźnik Sharpe'a</Label>
                    <Input
                      id="sharpeRatio"
                      type="number"
                      value={riskData.sharpeRatio}
                      onChange={(e) => setRiskData({...riskData, sharpeRatio: e.target.value})}
                      placeholder="0.8"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Interpretacja wskaźników:</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Zmienność:</strong> {parseFloat(riskData.volatility) < 10 ? 'Niskie' : parseFloat(riskData.volatility) < 20 ? 'Umiarkowane' : 'Wysokie'} ryzyko
                      </div>
                      <div>
                        <strong>Beta:</strong> {parseFloat(riskData.beta) < 1 ? 'Mniej' : 'Bardziej'} zmienne niż rynek
                      </div>
                      <div>
                        <strong>Sharpe:</strong> {parseFloat(riskData.sharpeRatio) > 1 ? 'Dobry' : parseFloat(riskData.sharpeRatio) > 0.5 ? 'Średni' : 'Słaby'} stosunek zwrotu do ryzyka
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
                      Rekomendacje:
                    </h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• Dywersyfikuj portfel między różne sektory</li>
                      <li>• Rozważ dodanie aktywów defensywnych</li>
                      <li>• Monitoruj korelacje między pozycjami</li>
                      <li>• Ustal limity stop-loss</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisTools;
