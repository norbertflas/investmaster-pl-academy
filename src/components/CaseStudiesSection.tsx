
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Globe, TrendingUp, BarChart3, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  asset_class: string;
  market: string;
  content: any;
}

const CaseStudiesSection = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCaseStudies(data || []);
    } catch (error) {
      console.error('Error fetching case studies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCaseStudies = caseStudies.filter(study => 
    filter === 'all' || study.difficulty_level === filter
  );

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'historical_crash': return <TrendingUp className="w-5 h-5" />;
      case 'company_analysis': return <BarChart3 className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Ładowanie studiów przypadków...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="case-studies" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            📚 Studia Przypadków
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Ucz się na Rzeczywistych Przykładach
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Analizuj historyczne wydarzenia, sukcesy i porażki, aby lepiej zrozumieć rynki finansowe.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            Wszystkie
          </Button>
          <Button
            variant={filter === 'beginner' ? 'default' : 'outline'}
            onClick={() => setFilter('beginner')}
            size="sm"
          >
            Początkujący
          </Button>
          <Button
            variant={filter === 'intermediate' ? 'default' : 'outline'}
            onClick={() => setFilter('intermediate')}
            size="sm"
          >
            Średniozaawansowany
          </Button>
          <Button
            variant={filter === 'advanced' ? 'default' : 'outline'}
            onClick={() => setFilter('advanced')}
            size="sm"
          >
            Zaawansowany
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCaseStudies.map((study) => (
            <Card key={study.id} className="hover:shadow-lg transition-all duration-300 hover-scale">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-primary">
                    {getCategoryIcon(study.category)}
                  </div>
                  <Badge className={getDifficultyColor(study.difficulty_level)}>
                    {study.difficulty_level === 'beginner' && 'Początkujący'}
                    {study.difficulty_level === 'intermediate' && 'Średniozaawansowany'}
                    {study.difficulty_level === 'advanced' && 'Zaawansowany'}
                  </Badge>
                </div>
                
                <CardTitle className="text-xl text-primary">
                  {study.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {study.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <span className="flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    {study.market === 'poland' ? 'Polska' : study.market === 'usa' ? 'USA' : study.market}
                  </span>
                  <span className="capitalize">{study.asset_class}</span>
                </div>

                <Button className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Przeczytaj studium
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCaseStudies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">
              Brak studiów przypadków dla wybranego poziomu trudności.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudiesSection;
