
import { useState } from 'react';
import { marketDataService } from '@/services/marketData';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  lastUpdated: string;
}

// Hook do używania w komponentach React
export const useMarketData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockPrice = async (symbol: string): Promise<StockData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = symbol.includes('.WA') ? 
        await marketDataService.getPolishStockPrice(symbol) :
        await marketDataService.getUSStockPrice(symbol);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchStockPrice,
    getCompanyInfo: marketDataService.getCompanyInfo.bind(marketDataService),
    getExchangeRates: marketDataService.getExchangeRates.bind(marketDataService),
    getFinancialNews: marketDataService.getFinancialNews.bind(marketDataService),
    loading,
    error
  };
};
