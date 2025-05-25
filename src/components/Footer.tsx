
import { Link } from 'react-router-dom';
import { TrendingUp, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">InvestMaster PL</h1>
                <p className="text-xs text-gray-400 leading-tight">Kształtujemy Inteligentnych Inwestorów</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm">
              Kompleksowa platforma edukacyjna dla polskich inwestorów. 
              Ucz się, analizuj i inwestuj świadomie.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Education Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Edukacja</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#modules" className="text-gray-400 hover:text-white transition-colors">Moduły Nauki</a></li>
              <li><a href="#case-studies" className="text-gray-400 hover:text-white transition-colors">Studia Przypadków</a></li>
              <li><a href="#glossary" className="text-gray-400 hover:text-white transition-colors">Słowniczek</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Webinary</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Kursy Certyfikowane</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Materiały PDF</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Zasoby</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#news" className="text-gray-400 hover:text-white transition-colors">Wiadomości Rynkowe</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Analiza Rynku</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Kalkulator Inwestycyjny</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Portfel Demo</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Dokumentacja</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kontakt</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>kontakt@investmaster.pl</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+48 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Warszawa, Polska</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Newsletter</h4>
              <p className="text-gray-400 text-xs mb-3">
                Otrzymuj cotygodniowe analizy rynku
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Twój email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-sm focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors text-sm">
                  Zapisz się
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 InvestMaster PL. Wszystkie prawa zastrzeżone.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Polityka Prywatności
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Regulamin
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Pomoc
              </a>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>
              Ostrzeżenie: Inwestowanie wiąże się z ryzykiem utraty kapitału. 
              Wszystkie materiały mają charakter edukacyjny i nie stanowią porady inwestycyjnej.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
