
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw, Trophy, Brain } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "Co oznacza wskaźnik P/E?",
      options: [
        "Stosunek ceny do zysku na akcję",
        "Stosunek ceny do wartości księgowej",
        "Stosunek zysku do przychodów",
        "Stosunek długu do kapitału"
      ],
      correctAnswer: 0,
      explanation: "P/E (Price to Earnings) to wskaźnik pokazujący ile inwestorzy są gotowi zapłacić za każdą złotówkę zysku spółki.",
      category: "Analiza fundamentalna"
    },
    {
      id: 2,
      question: "Czym jest dywersyfikacja portfela?",
      options: [
        "Kupowanie tylko jednego typu akcji",
        "Rozłożenie inwestycji na różne aktywa",
        "Sprzedaż wszystkich akcji",
        "Inwestowanie tylko w obligacje"
      ],
      correctAnswer: 1,
      explanation: "Dywersyfikacja to strategia rozłożenia ryzyka poprzez inwestowanie w różne rodzaje aktywów, sektory czy regiony.",
      category: "Zarządzanie ryzykiem"
    },
    {
      id: 3,
      question: "Co to jest stop loss?",
      options: [
        "Nakaz kupna akcji",
        "Zlecenie sprzedaży przy określonej stracie",
        "Rodzaj dywidendy",
        "Opłata maklerska"
      ],
      correctAnswer: 1,
      explanation: "Stop loss to zlecenie automatycznego zamknięcia pozycji przy określonym poziomie straty, chroniące przed większymi spadkami.",
      category: "Trading"
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newUserAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newUserAnswers);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizCompleted(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
    setUserAnswers([]);
  };

  const getScorePercentage = () => (score / questions.length) * 100;

  const getScoreMessage = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return "Świetny wynik! 🎉";
    if (percentage >= 60) return "Dobra robota! 👍";
    if (percentage >= 40) return "Możesz lepiej! 💪";
    return "Potrzebujesz więcej nauki 📚";
  };

  if (quizCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Quiz ukończony!</CardTitle>
          <CardDescription>{getScoreMessage()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {score}/{questions.length}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              {getScorePercentage().toFixed(0)}% poprawnych odpowiedzi
            </div>
          </div>
          
          <Progress value={getScorePercentage()} className="h-3" />
          
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Przegląd odpowiedzi:</h3>
            {questions.map((question, index) => (
              <div key={question.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {userAnswers[index] === question.correctAnswer ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <div className="font-medium text-sm">{question.question}</div>
                  <div className="text-xs text-gray-500">
                    Kategoria: {question.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button onClick={resetQuiz} className="w-full" size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Spróbuj ponownie
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-sm">
            {questions[currentQuestion].category}
          </Badge>
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>
        </div>
        <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
        <CardTitle className="text-xl mt-4">
          {questions[currentQuestion].question}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!showResult ? (
          <>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className="w-full text-left justify-start h-auto p-4"
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
            </div>
            
            <Button 
              onClick={handleNextQuestion} 
              disabled={selectedAnswer === null}
              className="w-full mt-6"
              size="lg"
            >
              {currentQuestion + 1 === questions.length ? 'Zakończ quiz' : 'Następne pytanie'}
            </Button>
          </>
        ) : (
          <div className="text-center space-y-4">
            {selectedAnswer === questions[currentQuestion].correctAnswer ? (
              <div className="flex flex-col items-center space-y-2">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <div className="text-xl font-bold text-green-600">Poprawna odpowiedź!</div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <XCircle className="w-16 h-16 text-red-500" />
                <div className="text-xl font-bold text-red-600">Niepoprawna odpowiedź</div>
                <div className="text-sm">
                  Poprawna odpowiedź: <strong>{questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}</strong>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Wyjaśnienie:</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {questions[currentQuestion].explanation}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Quiz;
