
import { ThemeProvider } from "next-themes";
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ModulesSection from '@/components/ModulesSection';
import NewsSection from '@/components/NewsSection';
import GlossarySection from '@/components/GlossarySection';
import UserDashboard from '@/components/UserDashboard';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <ModulesSection />
        <UserDashboard />
        <NewsSection />
        <GlossarySection />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
