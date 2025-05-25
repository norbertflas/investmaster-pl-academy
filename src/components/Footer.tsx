
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-financial-navy text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-financial-gold rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-financial-navy" />
              </div>
              <div>
                <h3 className="text-xl font-bold">InvestMaster PL</h3>
                <p className="text-blue-200 text-sm">Kształtujemy Inteligentnych Inwestorów</p>
              </div>
            </div>
            <p className="text-blue-200 mb-6 leading-relaxed">
              Kompleksowa platforma edukacyjna, która przekształca Cię w świadomego inwestora.
              Ucz się od podstaw i rozwijaj umiejętności inwestycyjne krok po kroku.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-blue-800">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-blue-800">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-blue-800">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-blue-800">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Platforma</h4>
            <nav className="space-y-3">
              <a href="#modules" className="block text-blue-200 hover:text-white transition-colors">Moduły Edukacyjne</a>
              <a href="#news" className="block text-blue-200 hover:text-white transition-colors">Wiadomości Rynkowe</a>
              <a href="#glossary" className="block text-blue-200 hover:text-white transition-colors">Słowniczek</a>
              <a href="#community" className="block text-blue-200 hover:text-white transition-colors">Społeczność</a>
              <a href="#certificates" className="block text-blue-200 hover:text-white transition-colors">Certyfikaty</a>
              <a href="#dashboard" className="block text-blue-200 hover:text-white transition-colors">Dashboard</a>
            </nav>
          </div>

          {/* Education Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Edukacja</h4>
            <nav className="space-y-3">
              <a href="#basic" className="block text-blue-200 hover:text-white transition-colors">Podstawy Inwestowania</a>
              <a href="#polish-market" className="block text-blue-200 hover:text-white transition-colors">Polski Rynek</a>
              <a href="#assets" className="block text-blue-200 hover:text-white transition-colors">Klasy Aktywów</a>
              <a href="#analysis" className="block text-blue-200 hover:text-white transition-colors">Analiza Techniczna</a>
              <a href="#ai-trading" className="block text-blue-200 hover:text-white transition-colors">AI w Tradingu</a>
              <a href="#case-studies" className="block text-blue-200 hover:text-white transition-colors">Studia Przypadków</a>
            </nav>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Kontakt</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 text-blue-200">
                <Mail className="w-4 h-4" />
                <span>kontakt@investmaster.pl</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-200">
                <Phone className="w-4 h-4" />
                <span>+48 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-200">
                <MapPin className="w-4 h-4" />
                <span>Warszawa, Polska</span>
              </div>
            </div>
            
            <nav className="space-y-3">
              <a href="#privacy" className="block text-blue-200 hover:text-white transition-colors">Polityka Prywatności</a>
              <a href="#terms" className="block text-blue-200 hover:text-white transition-colors">Regulamin</a>
              <a href="#about" className="block text-blue-200 hover:text-white transition-colors">O nas</a>
              <a href="#faq" className="block text-blue-200 hover:text-white transition-colors">FAQ</a>
            </nav>
          </div>
        </div>

        <Separator className="my-8 bg-blue-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-blue-200 text-sm">
            <p>© 2024 InvestMaster PL. Wszystkie prawa zastrzeżone.</p>
          </div>
          
          <div className="text-blue-200 text-sm text-center md:text-right">
            <p className="mb-1">
              <strong>Ważne:</strong> Platforma ma charakter wyłącznie edukacyjny.
            </p>
            <p>
              Nie stanowi doradztwa inwestycyjnego. Inwestowanie wiąże się z ryzykiem.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
