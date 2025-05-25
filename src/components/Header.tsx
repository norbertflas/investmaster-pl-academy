
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, User, Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-slate-900/95 dark:border-slate-700">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-financial-navy to-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-financial-navy dark:text-blue-400">InvestMaster PL</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">Kształtujemy Inteligentnych Inwestorów</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#modules" className="text-gray-700 hover:text-financial-navy dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Moduły</a>
          <a href="#news" className="text-gray-700 hover:text-financial-navy dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Wiadomości</a>
          <a href="#glossary" className="text-gray-700 hover:text-financial-navy dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Słowniczek</a>
          <a href="#community" className="text-gray-700 hover:text-financial-navy dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Społeczność</a>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            Online
          </Badge>
          <ThemeToggle />
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <User className="w-4 h-4 mr-2" />
            Profil
          </Button>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <a href="#modules" className="block py-2 text-gray-700 hover:text-financial-navy dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Moduły</a>
            <a href="#news" className="block py-2 text-gray-700 hover:text-financial-navy dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Wiadomości</a>
            <a href="#glossary" className="block py-2 text-gray-700 hover:text-financial-navy dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Słowniczek</a>
            <a href="#community" className="block py-2 text-gray-700 hover:text-financial-navy dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Społeczność</a>
            <div className="pt-2 border-t border-gray-200 dark:border-slate-700">
              <Button variant="outline" size="sm" className="w-full">
                <User className="w-4 h-4 mr-2" />
                Profil
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
