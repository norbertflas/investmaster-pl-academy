
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, PiggyBank, DollarSign, Percent } from 'lucide-react';

const InvestmentCalculator = () => {
  // Kalkulator odsetek składanych
  const [principal, setPrincipal] = useState<string>('10000');
  const [rate, setRate] = useState<string>('8');
  const [time, setTime] = useState<string>('10');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('500');

  // Kalkulator P/E
  const [stockPrice, setStockPrice] = useState<string>('100');
  const [eps, setEps] = useState<string>('5');

  // Kalkulator ROI
  const [initialInvestment, setInitialInvestment] = useState<string>('1000');
  const [finalValue, setFinalValue] = useState<string>('1200');

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(time) || 0;
    const pmt = parseFloat(monthlyContribution) || 0;

    // Kapitał początkowy z odsetkami składanymi
    const futureValuePrincipal = p * Math.pow(1 + r, t);
    
    // Wartość przyszła regularnych wpłat
    const futureValueAnnuity = pmt * 12 * (Math.pow(1 + r, t) - 1) / r;
    
    const totalFutureValue = futureValuePrincipal + futureValueAnnuity;
    const totalInvested = p + (pmt * 12 * t);
    const totalGain = totalFutureValue - totalInvested;

    return {
      futureValue: totalFutureValue,
      totalInvested,
      totalGain,
      gainPercentage: (totalGain / totalInvested) * 100
    };
  };

  const calculatePE = () => {
    const price = parseFloat(stockPrice) || 0;
    const earning = parseFloat(eps) || 0;
    return earning !== 0 ? price / earning : 0;
  };

  const calculateROI = () => {
    const initial = parseFloat(initialInvestment) || 0;
    const final = parseFloat(finalValue) || 0;
    const gain = final - initial;
    return {
      gain,
      roi: initial !== 0 ? (gain / initial) * 100 : 0
    };
  };

  const compoundResults = calculateCompoundInterest();
  const peRatio = calculatePE();
  const roiResults = calculateROI();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Kalkulatory Inwestycyjne
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Narzędzia do analizy i planowania inwestycji
        </p>
      </div>

      <Tabs defaultValue="compound" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compound" className="flex items-center space-x-2">
            <PiggyBank className="w-4 h-4" />
            <span>Odsetki składane</span>
          </TabsTrigger>
          <TabsTrigger value="pe" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Wskaźnik P/E</span>
          </TabsTrigger>
          <TabsTrigger value="roi" className="flex items-center space-x-2">
            <Percent className="w-4 h-4" />
            <span>ROI</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compound">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Parametry inwestycji</span>
                </CardTitle>
                <CardDescription>
                  Wprowadź dane swojej inwestycji
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="principal">Kapitał początkowy (zł)</Label>
                  <Input
                    id="principal"
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    placeholder="10000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rate">Roczna stopa zwrotu (%)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="8"
                    step="0.1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Okres inwestycji (lata)</Label>
                  <Input
                    id="time"
                    type="number"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthly">Miesięczna wpłata (zł)</Label>
                  <Input
                    id="monthly"
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    placeholder="500"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Wyniki</span>
                </CardTitle>
                <CardDescription>
                  Prognoza wartości inwestycji
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {compoundResults.futureValue.toLocaleString('pl-PL', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })} zł
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Wartość końcowa
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {compoundResults.totalGain.toLocaleString('pl-PL', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })} zł
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Zysk
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Łącznie zainwestowano:</span>
                    <span className="font-semibold">
                      {compoundResults.totalInvested.toLocaleString('pl-PL')} zł
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zwrot z inwestycji:</span>
                    <span className="font-semibold text-green-600">
                      {compoundResults.gainPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Uwaga:</strong> To jest tylko prognoza. Rzeczywiste wyniki mogą się różnić w zależności od warunków rynkowych.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pe">
          <Card>
            <CardHeader>
              <CardTitle>Kalkulator wskaźnika P/E</CardTitle>
              <CardDescription>
                Oblicz wskaźnik cena/zysk dla akcji
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stockPrice">Cena akcji (zł)</Label>
                    <Input
                      id="stockPrice"
                      type="number"
                      value={stockPrice}
                      onChange={(e) => setStockPrice(e.target.value)}
                      placeholder="100"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="eps">Zysk na akcję (zł)</Label>
                    <Input
                      id="eps"
                      type="number"
                      value={eps}
                      onChange={(e) => setEps(e.target.value)}
                      placeholder="5"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {peRatio.toFixed(2)}
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                      Wskaźnik P/E
                    </div>
                    <div className="max-w-md text-sm text-gray-500 dark:text-gray-400">
                      {peRatio < 15 && "Niska wycena - potencjalnie niedowartościowana"}
                      {peRatio >= 15 && peRatio <= 25 && "Umiarkowana wycena - typowa dla rynku"}
                      {peRatio > 25 && "Wysoka wycena - może być przewartościowana"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi">
          <Card>
            <CardHeader>
              <CardTitle>Kalkulator ROI (Return on Investment)</CardTitle>
              <CardDescription>
                Oblicz zwrot z inwestycji w procentach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="initialInvestment">Początkowa inwestycja (zł)</Label>
                    <Input
                      id="initialInvestment"
                      type="number"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(e.target.value)}
                      placeholder="1000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="finalValue">Końcowa wartość (zł)</Label>
                    <Input
                      id="finalValue"
                      type="number"
                      value={finalValue}
                      onChange={(e) => setFinalValue(e.target.value)}
                      placeholder="1200"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {roiResults.gain.toLocaleString('pl-PL')} zł
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Zysk/Strata
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className={`text-2xl font-bold ${roiResults.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {roiResults.roi.toFixed(2)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          ROI
                        </div>
                      </div>
                    </div>
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

export default InvestmentCalculator;
