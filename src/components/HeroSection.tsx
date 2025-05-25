
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Users, BookOpen } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 financial-gradient animate-gradient-shift opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Hero Badge */}
          <Badge className="mb-6 bg-financial-green/10 text-financial-navy border-financial-green/20 hover:bg-financial-green/20 dark:bg-financial-green/20 dark:text-green-400">
            🚀 Nowa era edukacji inwestycyjnej w Polsce
          </Badge>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-financial-navy to-blue-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent leading-tight">
            InvestMaster PL
          </h1>
          
          {/* Motto */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 font-medium">
            Kształtujemy Inteligentnych Inwestorów, Krok po Kroku
          </p>
          
          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Kompleksowa platforma edukacyjna, która przekształci Cię w świadomego inwestora. 
            Ucz się analizy rynkowej, zarządzania ryzykiem i budowania długoterminowego bogactwa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-financial-navy hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-8 py-3 h-auto">
              <BookOpen className="w-5 h-5 mr-2" />
              Rozpocznij Naukę
            </Button>
            <Button variant="outline" size="lg" className="border-financial-navy text-financial-navy hover:bg-financial-navy hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-slate-900 px-8 py-3 h-auto">
              Poznaj Platformę
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="p-6 glass-effect hover-scale">
              <div className="flex items-center justify-center w-12 h-12 bg-financial-navy/10 dark:bg-blue-500/20 rounded-lg mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-financial-navy dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-financial-navy dark:text-blue-400 mb-2">15+</h3>
              <p className="text-gray-600 dark:text-gray-400">Modułów Edukacyjnych</p>
            </Card>

            <Card className="p-6 glass-effect hover-scale">
              <div className="flex items-center justify-center w-12 h-12 bg-financial-green/10 dark:bg-green-500/20 rounded-lg mx-auto mb-4">
                <Users className="w-6 h-6 text-financial-green dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-financial-green dark:text-green-400 mb-2">5000+</h3>
              <p className="text-gray-600 dark:text-gray-400">Aktywnych Użytkowników</p>
            </Card>

            <Card className="p-6 glass-effect hover-scale">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 dark:bg-green-500/20 rounded-lg mx-auto mb-4">
                <Award className="w-6 h-6 text-green-500 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-green-500 dark:text-green-400 mb-2">98%</h3>
              <p className="text-gray-600 dark:text-gray-400">Satysfakcji Kursantów</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-financial-navy/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-financial-green/5 dark:bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
    </section>
  );
};

export default HeroSection;
