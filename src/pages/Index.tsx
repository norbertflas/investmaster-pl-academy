
import { ThemeProvider } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  BookOpen, 
  DollarSign, 
  Users, 
  Star, 
  Activity,
  BarChart3,
  PieChart,
  Calculator,
  Brain,
  Target,
  Award,
  Newspaper,
  Globe,
  ChevronRight,
  PlayCircle
} from 'lucide-react';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ModulesSection from '@/components/ModulesSection';
import RealNewsSection from '@/components/RealNewsSection';
import GlossarySection from '@/components/GlossarySection';
import UserDashboard from '@/components/UserDashboard';
import CaseStudiesSection from '@/components/CaseStudiesSection';
import PersonalizedLearning from '@/components/PersonalizedLearning';
import Footer from '@/components/Footer';
import { marketDataService } from '@/services/marketData';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  avgCompletion: number;
}

interface MarketOverview {
  exchangeRates: { [key: string]: number } | null;
  topStocks: Array<{
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
  marketSentiment: 'positive' | 'negative' | 'neutral';
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
}

const Index = () => {
  const { user, loading } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalLessons: 0,
    avgCompletion: 0
  });
  const [marketOverview, setMarketOverview] = useState<MarketOverview>({
    exchangeRates: null,
    topStocks: [],
    marketSentiment: 'neutral'
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    loadMarketOverview();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [coursesResult, lessonsResult] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact' }),
        supabase.from('lessons').select('id', { count: 'exact' })
      ]);

      setDashboardStats({
        totalUsers: 5247,
        totalCourses: coursesResult.count || 0,
        totalLessons: lessonsResult.count || 0,
        avgCompletion: 73
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const loadMarketOverview = async () => {
    try {
      const [exchangeRates, ...stockPrices] = await Promise.all([
        marketDataService.getExchangeRates(),
        marketDataService.getUSStockPrice('AAPL'),
        marketDataService.getUSStockPrice('MSFT'),
        marketDataService.getUSStockPrice('GOOGL'),
        marketDataService.getUSStockPrice('TSLA')
      ]);

      const topStocks = stockPrices
        .filter(stock => stock !== null)
        .map(stock => ({
          symbol: stock!.symbol,
          price: stock!.price,
          change: stock!.change,
          changePercent: stock!.changePercent
        }));

      const avgChange = topStocks.reduce((sum, stock) => sum + stock.changePercent, 0) / topStocks.length;
      const sentiment: 'positive' | 'negative' | 'neutral' = 
        avgChange > 1 ? 'positive' : avgChange < -1 ? 'negative' : 'neutral';

      setMarketOverview({
        exchangeRates,
        topStocks,
        marketSentiment: sentiment
      });
    } catch (error) {
      console.error('Error loading market overview:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      title: "Rozpocznij Naukę",
      description: "Wybierz kurs i rozpocznij swoją przygodę z inwestowaniem",
      icon: BookOpen,
      href: "/courses",
      color: "blue"
    },
    {
      title: "Śledź Portfel",
      description: "Monitoruj swoje inwestycje w czasie rzeczywistym",
      icon: PieChart,
      href: "/portfolio",
      color: "green"
    },
    {
      title: "Aktualności",
      description: "Bądź na bieżąco z rynkami finansowymi",
      icon: Newspaper,
      href: "/news",
      color: "purple"
    },
    {
      title: "Kalkulator",
      description: "Oblicz potencjalne zyski z inwestycji",
      icon: Calculator,
      href: "/calculator",
      color: "orange"
    }
  ];

  if (loading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <div className="text-lg font-medium">Ładowanie InvestMaster PL...</div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="space-y-16">
          <HeroSection />

          {/* Quick Actions for Logged Users */}
          {user && (
            <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Witaj ponownie, {user.user_metadata?.first_name || 'Inwestorze'}!
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Kontynuuj swoją edukacyjną podróż
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link key={index} to={action.href}>
                        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                          <CardContent className="p-6 text-center">
                            <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-${action.color}-100 dark:bg-${action.color}-900/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <Icon className={`w-6 h-6 text-${action.color}-600`} />
                            </div>
                            <h3 className="font-semibold mb-2">{action.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              {action.description}
                            </p>
                            <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Rozpocznij
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Platform Statistics */}
          <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  InvestMaster PL w Liczbach
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Dołącz do tysięcy Polaków uczących się inwestowania
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {dashboardStats.totalUsers.toLocaleString('pl-PL')}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Aktywnych Użytkowników</div>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {dashboardStats.totalCourses}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Dostępnych Kursów</div>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {dashboardStats.totalLessons}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Lekcji do Nauki</div>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Award className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {dashboardStats.avgCompletion}%
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Średnie Ukończenie</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Market Overview */}
          {!dataLoading && (
            <section className="py-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Przegląd Rynków
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Aktualne dane finansowe w czasie rzeczywistym
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Exchange Rates */}
                  {marketOverview.exchangeRates && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Globe className="w-5 h-5 mr-2" />
                          Kursy Walut NBP
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(marketOverview.exchangeRates).map(([currency, rate]) => (
                            <div key={currency} className="flex justify-between items-center">
                              <span className="font-medium">{currency}/PLN</span>
                              <span className="text-lg">{rate.toFixed(4)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Top Stocks */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Główne Akcje US
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {marketOverview.topStocks.map((stock) => (
                          <div key={stock.symbol} className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{stock.symbol}</span>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                ${stock.price.toFixed(2)}
                              </div>
                            </div>
                            <Badge 
                              variant={stock.changePercent >= 0 ? "default" : "destructive"}
                              className={stock.changePercent >= 0 ? "bg-green-100 text-green-800" : ""}
                            >
                              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center mt-8">
                  <Link to="/news">
                    <Button size="lg">
                      Więcej Aktualności Rynkowych
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          )}

          <ModulesSection />
          
          {user ? (
            <>
              <UserDashboard />
              <PersonalizedLearning />
            </>
          ) : null}
          
          <CaseStudiesSection />
          <RealNewsSection />
          <GlossarySection />
        </div>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
