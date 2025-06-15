
import { ThemeProvider } from "next-themes";
import Header from '@/components/Header';
import RealPortfolioTracker from '@/components/RealPortfolioTracker';
import Footer from '@/components/Footer';

const PortfolioPage = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="container mx-auto px-4">
            <RealPortfolioTracker />
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default PortfolioPage;
