
import { ThemeProvider } from "next-themes";
import Header from '@/components/Header';
import RealNewsSection from '@/components/RealNewsSection';
import Footer from '@/components/Footer';

const NewsPage = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Aktualności Finansowe
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Najnowsze wiadomości z rynków finansowych i gospodarki
              </p>
            </div>
            <RealNewsSection />
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default NewsPage;
