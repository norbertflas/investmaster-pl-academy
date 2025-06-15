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

interface CompanyInfo {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  pe: number;
  beta: number;
  dividendYield: number;
  description: string;
}

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relevantSymbols: string[];
  url: string;
}

class MarketDataService {
  private readonly NBP_API_BASE = 'https://api.nbp.pl/api';
  private readonly SUPABASE_FUNCTION_URL = 'https://bkbnbvtbkgozzxqekoxv.supabase.co/functions/v1/market-data';

  // Cache dla optymalizacji - dane giełdowe nie zmieniają się co sekundę
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minut

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

  // Helper method to call our Supabase edge function
  private async callAlphaVantageAPI(params: Record<string, any>): Promise<any> {
    const response = await fetch(this.SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

  // Pobieranie cen akcji polskich (GPW)
  async getPolishStockPrice(symbol: string): Promise<StockData | null> {
    const cacheKey = `polish_stock_${symbol}`;
    const cached = this.getCachedData<StockData>(cacheKey);
    if (cached) return cached;

    try {
      // Alpha Vantage ma ograniczone wsparcie dla GPW
      // Alternatywnie można użyć Stooq API (darmowe dla GPW)
      const stooqUrl = `https://stooq.pl/q/l/?s=${symbol.toLowerCase()}&f=sd2t2ohlcv&h&e=csv`;
      
      const response = await fetch(stooqUrl);
      const csvData = await response.text();
      const lines = csvData.trim().split('\n');
      
      if (lines.length < 2) return null;
      
      const data = lines[1].split(',');
      const price = parseFloat(data[4]); // Close price
      const previousClose = parseFloat(data[1]); // Open price jako aproksymacja
      const change = price - previousClose;
      const changePercent = (change / previousClose) * 100;

      const stockData: StockData = {
        symbol: symbol.toUpperCase(),
        price,
        change,
        changePercent,
        volume: parseInt(data[6]) || 0,
        lastUpdated: new Date().toISOString()
      };

      this.setCachedData(cacheKey, stockData);
      return stockData;
    } catch (error) {
      console.error(`Error fetching Polish stock ${symbol}:`, error);
      return null;
    }
  }

  // Pobieranie cen akcji amerykańskich
  async getUSStockPrice(symbol: string): Promise<StockData | null> {
    const cacheKey = `us_stock_${symbol}`;
    const cached = this.getCachedData<StockData>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAlphaVantageAPI({
        function: 'GLOBAL_QUOTE',
        symbol: symbol
      });

      const quote = data['Global Quote'];
      if (!quote) return null;

      const stockData: StockData = {
        symbol: symbol.toUpperCase(),
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        lastUpdated: quote['07. latest trading day']
      };

      this.setCachedData(cacheKey, stockData);
      return stockData;
    } catch (error) {
      console.error(`Error fetching US stock ${symbol}:`, error);
      return null;
    }
  }

  // Informacje o spółce
  async getCompanyInfo(symbol: string): Promise<CompanyInfo | null> {
    const cacheKey = `company_${symbol}`;
    const cached = this.getCachedData<CompanyInfo>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAlphaVantageAPI({
        function: 'OVERVIEW',
        symbol: symbol
      });

      if (!data['Symbol']) {
        return null;
      }

      const companyInfo: CompanyInfo = {
        symbol: data['Symbol'],
        name: data['Name'],
        sector: data['Sector'] || 'N/A',
        industry: data['Industry'] || 'N/A',
        marketCap: parseInt(data['MarketCapitalization']) || 0,
        pe: parseFloat(data['PERatio']) || 0,
        beta: parseFloat(data['Beta']) || 0,
        dividendYield: parseFloat(data['DividendYield']) || 0,
        description: data['Description'] || ''
      };

      this.setCachedData(cacheKey, companyInfo);
      return companyInfo;
    } catch (error) {
      console.error(`Error fetching company info for ${symbol}:`, error);
      return null;
    }
  }

  // Kursy walut z NBP
  async getExchangeRates(): Promise<{ [key: string]: number } | null> {
    const cacheKey = 'exchange_rates';
    const cached = this.getCachedData<{ [key: string]: number }>(cacheKey);
    if (cached) return cached;

    try {
      // Pobieramy najważniejsze waluty
      const currencies = ['USD', 'EUR', 'GBP', 'CHF'];
      const rates: { [key: string]: number } = {};

      for (const currency of currencies) {
        const url = `${this.NBP_API_BASE}/exchangerates/rates/a/${currency}/?format=json`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.rates && data.rates.length > 0) {
          rates[currency] = data.rates[0].mid;
        }
      }

      this.setCachedData(cacheKey, rates);
      return rates;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      return null;
    }
  }

  // Stopy procentowe NBP
  async getInterestRates(): Promise<{ rate: number; date: string } | null> {
    const cacheKey = 'interest_rates';
    const cached = this.getCachedData<{ rate: number; date: string }>(cacheKey);
    if (cached) return cached;

    try {
      // Dla uproszenia - prawdziwe API dla stóp to inny endpoint
      const result = {
        rate: 5.75, // Aktualna stopa referencyjna NBP (należy pobrać z prawdziwego API)
        date: new Date().toISOString().split('T')[0]
      };

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching interest rates:', error);
      return null;
    }
  }

  // Wiadomości finansowe
  async getFinancialNews(limit: number = 10): Promise<NewsItem[]> {
    const cacheKey = `financial_news_${limit}`;
    const cached = this.getCachedData<NewsItem[]>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAlphaVantageAPI({
        function: 'NEWS_SENTIMENT',
        topics: 'financial_markets',
        limit: limit
      });

      if (!data.feed) return [];

      const news: NewsItem[] = data.feed.map((item: any) => ({
        title: item.title,
        summary: item.summary,
        source: item.source,
        publishedAt: item.time_published,
        sentiment: this.mapSentiment(item.overall_sentiment_score),
        relevantSymbols: item.ticker_sentiment?.map((t: any) => t.ticker) || [],
        url: item.url
      }));

      this.setCachedData(cacheKey, news);
      return news;
    } catch (error) {
      console.error('Error fetching financial news:', error);
      return [];
    }
  }

  private mapSentiment(score: number): 'positive' | 'negative' | 'neutral' {
    if (score > 0.35) return 'positive';
    if (score < -0.35) return 'negative';
    return 'neutral';
  }

  // Indeksy giełdowe (WIG20, S&P500, itp.)
  async getMarketIndices(): Promise<{ [key: string]: StockData }> {
    const indices = {
      'SPY': 'S&P 500',
      'QQQ': 'NASDAQ',
      'DIA': 'Dow Jones'
    };

    const results: { [key: string]: StockData } = {};

    for (const [symbol, name] of Object.entries(indices)) {
      const data = await this.getUSStockPrice(symbol);
      if (data) {
        results[name] = data;
      }
    }

    return results;
  }

  // Kryptowaluty (bonus)
  async getCryptoPrice(symbol: string): Promise<StockData | null> {
    const cacheKey = `crypto_${symbol}`;
    const cached = this.getCachedData<StockData>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.callAlphaVantageAPI({
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: symbol,
        to_currency: 'USD'
      });

      const exchangeRate = data['Realtime Currency Exchange Rate'];
      if (!exchangeRate) return null;

      const price = parseFloat(exchangeRate['5. Exchange Rate']);
      const stockData: StockData = {
        symbol: symbol.toUpperCase(),
        price,
        change: 0, // Alpha Vantage crypto API nie daje change
        changePercent: 0,
        volume: 0,
        lastUpdated: exchangeRate['6. Last Refreshed']
      };

      this.setCachedData(cacheKey, stockData);
      return stockData;
    } catch (error) {
      console.error(`Error fetching crypto ${symbol}:`, error);
      return null;
    }
  }

  // Metoda do testowania API
  async testConnection(): Promise<boolean> {
    try {
      const testStock = await this.getUSStockPrice('AAPL');
      return testStock !== null;
    } catch {
      return false;
    }
  }

  // Batch request dla wielu symboli (optymalizacja)
  async getBatchStockPrices(symbols: string[]): Promise<StockData[]> {
    const promises = symbols.map(symbol => 
      symbol.includes('.WA') ? 
        this.getPolishStockPrice(symbol) : 
        this.getUSStockPrice(symbol)
    );
    
    const results = await Promise.allSettled(promises);
    return results
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => (result as PromiseFulfilledResult<StockData>).value);
  }
}

// Singleton instance
export const marketDataService = new MarketDataService();
