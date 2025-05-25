
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, TrendingUp } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">InvestMaster PL</h1>
          </div>
        </Link>

        {/* 404 Error */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Strona nie znaleziona
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Ups! Wygląda na to, że strona, której szukasz, nie istnieje lub została przeniesiona.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" />
              Wróć na stronę główną
            </Button>
          </Link>
          
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Wróć do poprzedniej strony
            </Button>
          </div>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Potrzebujesz pomocy? Sprawdź nasze popularne sekcje:
          </p>
          <div className="space-y-2">
            <Link to="/#modules" className="block text-blue-600 dark:text-blue-400 hover:underline">
              Moduły Edukacyjne
            </Link>
            <Link to="/#case-studies" className="block text-blue-600 dark:text-blue-400 hover:underline">
              Studia Przypadków
            </Link>
            <Link to="/#glossary" className="block text-blue-600 dark:text-blue-400 hover:underline">
              Słowniczek Inwestycyjny
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
