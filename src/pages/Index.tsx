
import { ThemeProvider } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ModulesSection from '@/components/ModulesSection';
import NewsSection from '@/components/NewsSection';
import GlossarySection from '@/components/GlossarySection';
import UserDashboard from '@/components/UserDashboard';
import CaseStudiesSection from '@/components/CaseStudiesSection';
import PersonalizedLearning from '@/components/PersonalizedLearning';
import Footer from '@/components/Footer';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-lg">Ładowanie...</div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <ModulesSection />
        {user ? (
          <>
            <UserDashboard />
            <PersonalizedLearning />
          </>
        ) : null}
        <CaseStudiesSection />
        <NewsSection />
        <GlossarySection />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
