import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Clock, Star, ChevronRight, Target, CheckCircle, Lock, Play, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  order_index: number;
  is_premium: boolean;
  created_at: string;
  lessons: Lesson[];
  progress?: CourseProgress;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: any;
  quiz_questions: QuizQuestion[];
  xp_reward: number;
  order_index: number;
  duration_minutes: number;
  completed?: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: string;
}

interface CourseProgress {
  course_id: string;
  lessons_completed: number;
  total_lessons: number;
  completion_percentage: number;
  last_accessed: string;
  xp_earned: number;
}

interface UserStats {
  total_xp: number;
  level: number;
  courses_completed: number;
  current_streak: number;
}

const CourseSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    total_xp: 0,
    level: 1,
    courses_completed: 0,
    current_streak: 0
  });
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);

  useEffect(() => {
    loadCourses();
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadCourses = async () => {
    try {
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select(`
          *,
          lessons:lessons(*)
        `)
        .order('order_index');

      if (error) throw error;

      if (coursesData && coursesData.length > 0) {
        // Type assertion and proper type conversion
        const typedCourses: Course[] = coursesData.map(course => ({
          ...course,
          difficulty_level: course.difficulty_level as 'beginner' | 'intermediate' | 'advanced',
          lessons: (course.lessons || []).map((lesson: any) => ({
            ...lesson,
            content: lesson.content || {},
            quiz_questions: Array.isArray(lesson.quiz_questions) ? lesson.quiz_questions : [],
            course_id: lesson.course_id || course.id,
            xp_reward: lesson.xp_reward || 0,
            order_index: lesson.order_index || 0,
            duration_minutes: lesson.duration_minutes || 10
          }))
        }));

        let coursesWithProgress = typedCourses;
        
        if (user) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id);

          coursesWithProgress = typedCourses.map(course => {
            const courseProgress = progressData?.filter(p => p.module_id === course.id) || [];
            const completedLessons = courseProgress.filter(p => p.completed_at).length;
            const totalLessons = course.lessons?.length || 0;
            
            return {
              ...course,
              progress: {
                course_id: course.id,
                lessons_completed: completedLessons,
                total_lessons: totalLessons,
                completion_percentage: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
                last_accessed: courseProgress[0]?.created_at || course.created_at,
                xp_earned: courseProgress.reduce((sum, p) => sum + (p.xp_earned || 0), 0)
              }
            };
          });
        }

        setCourses(coursesWithProgress);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować kursów",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const { data: statsData, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (statsData) {
        setUserStats({
          total_xp: statsData.total_xp || 0,
          level: statsData.level || 1,
          courses_completed: statsData.modules_completed || 0,
          current_streak: statsData.streak_days || 0
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const startCourse = (course: Course) => {
    setActiveCourse(course);
    if (course.lessons && course.lessons.length > 0) {
      setActiveLesson(course.lessons[0]);
    }
  };

  const startLesson = async (lesson: Lesson) => {
    setLessonLoading(true);
    setActiveLesson(lesson);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            module_id: activeCourse?.id,
            lesson_id: lesson.id,
            created_at: new Date().toISOString()
          });

        if (error) console.error('Error updating progress:', error);
      } catch (error) {
        console.error('Error accessing lesson:', error);
      }
    }
    
    setLessonLoading(false);
  };

  const completeLesson = async (lesson: Lesson, quizScore?: number) => {
    if (!user || !activeCourse) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          module_id: activeCourse.id,
          lesson_id: lesson.id,
          completed_at: new Date().toISOString(),
          score: quizScore || 100,
          xp_earned: lesson.xp_reward
        });

      if (error) throw error;

      toast({
        title: "Gratulacje! 🎉",
        description: `Ukończyłeś lekcję i zdobyłeś ${lesson.xp_reward} XP!`,
      });

      await loadCourses();
      await loadUserStats();

    } catch (error) {
      console.error('Error completing lesson:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać postępu",
        variant: "destructive"
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Początkujący';
      case 'intermediate': return 'Średniozaawansowany';
      case 'advanced': return 'Zaawansowany';
      default: return 'Podstawowy';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  // Lesson View
  if (activeLesson && activeCourse) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setActiveLesson(null)}
              className="mb-2"
            >
              ← Powrót do kursu
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {activeLesson.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {activeCourse.title} • Lekcja {activeLesson.order_index}
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              {activeLesson.duration_minutes} min
            </Badge>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              +{activeLesson.xp_reward} XP
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {lessonLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {activeLesson.content?.sections?.map((section: any, index: number) => (
                  <div key={index} className="mb-6">
                    {section.type === 'paragraph' && (
                      <p className="text-lg leading-relaxed">{section.content}</p>
                    )}
                    {section.type === 'key_points' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                        <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">
                          Kluczowe punkty:
                        </h4>
                        <ul className="space-y-2">
                          {section.points.map((point: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0" />
                              <span className="text-blue-700 dark:text-blue-300">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Przewidywany czas: {activeLesson.duration_minutes} minut
                  </div>
                  <Button 
                    onClick={() => completeLesson(activeLesson)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Oznacz jako ukończone
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Course Detail View
  if (activeCourse) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setActiveCourse(null)}
              className="mb-2"
            >
              ← Powrót do kursów
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {activeCourse.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
              {activeCourse.description}
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className={getDifficultyColor(activeCourse.difficulty_level)}>
              {getDifficultyText(activeCourse.difficulty_level)}
            </Badge>
            {activeCourse.is_premium && (
              <Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500">
                Premium
              </Badge>
            )}
          </div>
        </div>

        {activeCourse.progress && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Postęp w kursie</h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {activeCourse.progress.lessons_completed} / {activeCourse.progress.total_lessons} lekcji
                </span>
              </div>
              <Progress value={activeCourse.progress.completion_percentage} className="h-3" />
              <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{activeCourse.progress.completion_percentage.toFixed(0)}% ukończone</span>
                <span>{activeCourse.progress.xp_earned} XP zdobyte</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          {activeCourse.lessons?.map((lesson, index) => {
            const isCompleted = activeCourse.progress ? 
              activeCourse.progress.lessons_completed > index : false;
            const isLocked = activeCourse.is_premium && !user;

            return (
              <Card 
                key={lesson.id} 
                className={`transition-all duration-200 hover:shadow-lg ${isCompleted ? 'border-green-200 bg-green-50 dark:bg-green-950' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' : 
                        isLocked ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{lesson.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {lesson.duration_minutes} min
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {lesson.xp_reward} XP
                          </span>
                          {lesson.quiz_questions?.length > 0 && (
                            <span className="flex items-center">
                              <Target className="w-4 h-4 mr-1" />
                              Quiz
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => startLesson(lesson)}
                      disabled={isLocked}
                      variant={isCompleted ? "outline" : "default"}
                    >
                      {isLocked ? 'Premium' : isCompleted ? 'Przejrzyj' : 'Rozpocznij'}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Main Courses View
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          System Kursów Edukacyjnych
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Kompleksowy program nauki od podstaw do zaawansowanych strategii
        </p>
      </div>

      {/* User Stats */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Poziom</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {userStats.level}
                  </p>
                </div>
                <Award className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Total XP</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {userStats.total_xp}
                  </p>
                </div>
                <Star className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Ukończone</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {userStats.courses_completed}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Passa</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {userStats.current_streak} dni
                  </p>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className={getDifficultyColor(course.difficulty_level)}>
                  {getDifficultyText(course.difficulty_level)}
                </Badge>
                {course.is_premium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                    Premium
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {course.title}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {course.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {course.progress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Postęp</span>
                    <span className="font-medium">{course.progress.completion_percentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={course.progress.completion_percentage} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.estimated_hours}h
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {course.lessons?.length || 0} lekcji
                </div>
              </div>

              <Button 
                onClick={() => startCourse(course)}
                className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors"
              >
                {course.progress?.completion_percentage > 0 ? 'Kontynuuj' : 'Rozpocznij kurs'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseSystem;
