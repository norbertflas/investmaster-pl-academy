
import { ThemeProvider } from "next-themes";
import Header from '@/components/Header';
import AnalysisTools from '@/components/AnalysisTools';
import Footer from '@/components/Footer';

const AnalysisPage = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <AnalysisTools />
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default AnalysisPage;
