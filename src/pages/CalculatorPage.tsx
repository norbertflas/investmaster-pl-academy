
import { ThemeProvider } from "next-themes";
import Header from '@/components/Header';
import InvestmentCalculator from '@/components/InvestmentCalculator';
import Footer from '@/components/Footer';

const CalculatorPage = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <InvestmentCalculator />
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default CalculatorPage;
