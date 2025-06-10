
import { ThemeProvider } from "next-themes";
import Header from '@/components/Header';
import CourseSystem from '@/components/CourseSystem';
import Footer from '@/components/Footer';

const CoursesPage = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <CourseSystem />
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default CoursesPage;
