
import { ThemeProvider } from "next-themes";
import Header from '@/components/Header';
import Quiz from '@/components/Quiz';
import Footer from '@/components/Footer';

const QuizPage = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <Quiz />
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default QuizPage;
