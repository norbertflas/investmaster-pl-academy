
import { ThemeProvider } from "next-themes";
import Header from '@/components/Header';
import LearningProgress from '@/components/LearningProgress';
import Footer from '@/components/Footer';

const ProgressPage = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <LearningProgress />
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default ProgressPage;
