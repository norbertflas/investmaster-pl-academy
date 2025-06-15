
interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TechnicalIndicator {
  date: string;
  value: number;
  signal?: string;
}

interface IncomeStatement {
  fiscalDateEnding: string;
  totalRevenue: number;
  grossProfit: number;
  netIncome: number;
  eps: number;
}

interface BalanceSheet {
  fiscalDateEnding: string;
  totalAssets: number;
  totalLiabilities: number;
  totalShareholderEquity: number;
}

interface EarningsData {
  fiscalDateEnding: string;
  reportedEPS: number;
  estimatedEPS: number;
  surprise: number;
  surprisePercentage: number;
}

class AlphaVantageService {
  private readonly SUPABASE_FUNCTION_URL = 'https://bkbnbvtbkgozzxqekoxv.supabase.co/functions/v1/market-data';
  
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minut

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async callAPI(params: Record<string, any>): Promise<any> {
    const response = await fetch(this.SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYm5idnRia2dvenp4cWVrb3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMDM0NTIsImV4cCI6MjA2Mzc3OTQ1Mn0.xnhsg-_UTPbp-OLuG6GCd11UJYQ-KOHnHDWuNoybPG8`
      },
      body: JSON.stringify({
        endpoint: 'query',
        params
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Dane historyczne - ceny dzienne
  async getDailyPrices(symbol: string, outputsize: 'compact' | 'full' = 'compact'): Promise<HistoricalData[]> {
    const cacheKey = `daily_${symbol}_${outputsize}`;
    const cached = this.getCachedData<HistoricalData[]>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAPI({
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize
      });

      const timeSeries = data['Time Series (Daily)'];
      if (!timeSeries) return [];

      const historicalData: HistoricalData[] = Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      }));

      this.setCachedData(cacheKey, historicalData);
      return historicalData;
    } catch (error) {
      console.error(`Error fetching daily prices for ${symbol}:`, error);
      return [];
    }
  }

  // Dane tygodniowe
  async getWeeklyPrices(symbol: string): Promise<HistoricalData[]> {
    const cacheKey = `weekly_${symbol}`;
    const cached = this.getCachedData<HistoricalData[]>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAPI({
        function: 'TIME_SERIES_WEEKLY',
        symbol
      });

      const timeSeries = data['Weekly Time Series'];
      if (!timeSeries) return [];

      const historicalData: HistoricalData[] = Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      }));

      this.setCachedData(cacheKey, historicalData);
      return historicalData;
    } catch (error) {
      console.error(`Error fetching weekly prices for ${symbol}:`, error);
      return [];
    }
  }

  // RSI (Relative Strength Index)
  async getRSI(symbol: string, interval: string = 'daily', timePeriod: number = 14): Promise<TechnicalIndicator[]> {
    const cacheKey = `rsi_${symbol}_${interval}_${timePeriod}`;
    const cached = this.getCachedData<TechnicalIndicator[]>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAPI({
        function: 'RSI',
        symbol,
        interval,
        time_period: timePeriod,
        series_type: 'close'
      });

      const technicalAnalysis = data['Technical Analysis: RSI'];
      if (!technicalAnalysis) return [];

      const rsiData: TechnicalIndicator[] = Object.entries(technicalAnalysis).map(([date, values]: [string, any]) => ({
        date,
        value: parseFloat(values['RSI']),
        signal: parseFloat(values['RSI']) > 70 ? 'SELL' : parseFloat(values['RSI']) < 30 ? 'BUY' : 'HOLD'
      }));

      this.setCachedData(cacheKey, rsiData);
      return rsiData;
    } catch (error) {
      console.error(`Error fetching RSI for ${symbol}:`, error);
      return [];
    }
  }

  // MACD
  async getMACD(symbol: string, interval: string = 'daily'): Promise<any[]> {
    const cacheKey = `macd_${symbol}_${interval}`;
    const cached = this.getCachedData<any[]>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAPI({
        function: 'MACD',
        symbol,
        interval,
        series_type: 'close'
      });

      const technicalAnalysis = data['Technical Analysis: MACD'];
      if (!technicalAnalysis) return [];

      const macdData = Object.entries(technicalAnalysis).map(([date, values]: [string, any]) => ({
        date,
        macd: parseFloat(values['MACD']),
        signal: parseFloat(values['MACD_Signal']),
        histogram: parseFloat(values['MACD_Hist'])
      }));

      this.setCachedData(cacheKey, macdData);
      return macdData;
    } catch (error) {
      console.error(`Error fetching MACD for ${symbol}:`, error);
      return [];
    }
  }

  // Średnie kroczące
  async getSMA(symbol: string, interval: string = 'daily', timePeriod: number = 20): Promise<TechnicalIndicator[]> {
    const cacheKey = `sma_${symbol}_${interval}_${timePeriod}`;
    const cached = this.getCachedData<TechnicalIndicator[]>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAPI({
        function: 'SMA',
        symbol,
        interval,
        time_period: timePeriod,
        series_type: 'close'
      });

      const technicalAnalysis = data['Technical Analysis: SMA'];
      if (!technicalAnalysis) return [];

      const smaData: TechnicalIndicator[] = Object.entries(technicalAnalysis).map(([date, values]: [string, any]) => ({
        date,
        value: parseFloat(values['SMA'])
      }));

      this.setCachedData(cacheKey, smaData);
      return smaData;
    } catch (error) {
      console.error(`Error fetching SMA for ${symbol}:`, error);
      return [];
    }
  }

  // Rachunek zysków i strat
  async getIncomeStatement(symbol: string): Promise<IncomeStatement[]> {
    const cacheKey = `income_${symbol}`;
    const cached = this.getCachedData<IncomeStatement[]>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAPI({
        function: 'INCOME_STATEMENT',
        symbol
      });

      const annualReports = data['annualReports'];
      if (!annualReports) return [];

      const incomeData: IncomeStatement[] = annualReports.slice(0, 5).map((report: any) => ({
        fiscalDateEnding: report['fiscalDateEnding'],
        totalRevenue: parseInt(report['totalRevenue']) || 0,
        grossProfit: parseInt(report['grossProfit']) || 0,
        netIncome: parseInt(report['netIncome']) || 0,
        eps: parseFloat(report['reportedEPS']) || 0
      }));

      this.setCachedData(cacheKey, incomeData);
      return incomeData;
    } catch (error) {
      console.error(`Error fetching income statement for ${symbol}:`, error);
      return [];
    }
  }

  // Bilans
  async getBalanceSheet(symbol: string): Promise<BalanceSheet[]> {
    const cacheKey = `balance_${symbol}`;
    const cached = this.getCachedData<BalanceSheet[]>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAPI({
        function: 'BALANCE_SHEET',
        symbol
      });

      const annualReports = data['annualReports'];
      if (!annualReports) return [];

      const balanceData: BalanceSheet[] = annualReports.slice(0, 5).map((report: any) => ({
        fiscalDateEnding: report['fiscalDateEnding'],
        totalAssets: parseInt(report['totalAssets']) || 0,
        totalLiabilities: parseInt(report['totalLiabilities']) || 0,
        totalShareholderEquity: parseInt(report['totalShareholderEquity']) || 0
      }));

      this.setCachedData(cacheKey, balanceData);
      return balanceData;
    } catch (error) {
      console.error(`Error fetching balance sheet for ${symbol}:`, error);
      return [];
    }
  }

  // Dane o zyskach
  async getEarnings(symbol: string): Promise<EarningsData[]> {
    const cacheKey = `earnings_${symbol}`;
    const cached = this.getCachedData<EarningsData[]>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAPI({
        function: 'EARNINGS',
        symbol
      });

      const quarterlyEarnings = data['quarterlyEarnings'];
      if (!quarterlyEarnings) return [];

      const earningsData: EarningsData[] = quarterlyEarnings.slice(0, 8).map((earnings: any) => ({
        fiscalDateEnding: earnings['fiscalDateEnding'],
        reportedEPS: parseFloat(earnings['reportedEPS']) || 0,
        estimatedEPS: parseFloat(earnings['estimatedEPS']) || 0,
        surprise: parseFloat(earnings['surprise']) || 0,
        surprisePercentage: parseFloat(earnings['surprisePercentage']) || 0
      }));

      this.setCachedData(cacheKey, earningsData);
      return earningsData;
    } catch (error) {
      console.error(`Error fetching earnings for ${symbol}:`, error);
      return [];
    }
  }

  // Indeksy sektorowe
  async getSectorPerformance(): Promise<any> {
    const cacheKey = 'sector_performance';
    const cached = this.getCachedData<any>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAPI({
        function: 'SECTOR'
      });

      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching sector performance:', error);
      return null;
    }
  }

  // Wyszukiwanie symboli
  async searchSymbols(keywords: string): Promise<any[]> {
    try {
      const data = await this.callAPI({
        function: 'SYMBOL_SEARCH',
        keywords
      });

      return data['bestMatches'] || [];
    } catch (error) {
      console.error(`Error searching symbols for ${keywords}:`, error);
      return [];
    }
  }

  // Top zysków i strat
  async getTopGainersLosers(): Promise<any> {
    const cacheKey = 'top_gainers_losers';
    const cached = this.getCachedData<any>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAPI({
        function: 'TOP_GAINERS_LOSERS'
      });

      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching top gainers/losers:', error);
      return null;
    }
  }
}

export const alphaVantageService = new AlphaVantageService();
