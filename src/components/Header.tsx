
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, User, Menu, X, LogOut, BookOpen, PieChart, Newspaper, Calculator, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from '@/components/ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const navigationItems = [
    { href: "/courses", label: "Kursy", icon: BookOpen },
    { href: "/portfolio", label: "Portfel", icon: PieChart },
    { href: "/news", label: "Aktualności", icon: Newspaper },
    { href: "/calculator", label: "Kalkulator", icon: Calculator },
    { href: "/analysis", label: "Analiza", icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-slate-900/95 dark:border-slate-700">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">InvestMaster PL</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">Kształtujemy Inteligentnych Inwestorów</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.href}
                to={item.href} 
                className="flex items-center space-x-1 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {user && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Online
            </Badge>
          )}
          <ThemeToggle />
          
          {user ? (
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                {user.user_metadata?.first_name || 'Profil'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <User className="w-4 h-4 mr-2" />
                Zaloguj się
              </Button>
            </Link>
          )}
          
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
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-2 py-2 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-gray-200 dark:border-slate-700">
              {user ? (
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    {user.user_metadata?.first_name || 'Profil'}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Wyloguj się
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Zaloguj się
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
