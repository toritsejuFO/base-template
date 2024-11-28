import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const questions = [
  { q: "What is 15 + 37?", a: "52" },
  { q: "Solve: 2 * (3 + 4)", a: "14" },
  { q: "What is 100 - 49?", a: "51" },
  { q: "Calculate: 5 * 8 + 6", a: "46" },
  { q: "Simplify: 20 / 4 + 3", a: "8" },
  // More questions can be added here
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generateQuestion() {
  shuffleArray(questions);
  return questions[0];
}

function QuestionCard({ question, onAnswer, timeLeft, onNext, showSolution, solution }) {
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const checkAnswer = () => {
    const correct = answer.trim() === question.a;
    setIsCorrect(correct);
    onAnswer(correct);
  };

  return (
    <Card className="w-full sm:w-3/4 lg:w-1/2 mx-auto mt-10">
      <CardHeader>
        <CardTitle>{question.q}</CardTitle>
        <CardDescription>Time Left: {timeLeft}s</CardDescription>
      </CardHeader>
      <CardContent>
        <Input 
          placeholder="Your answer" 
          value={answer} 
          onChange={(e) => setAnswer(e.target.value)} 
          disabled={isCorrect !== null}
        />
        {showSolution && (
          <div className="mt-4 text-sm">
            <p>Solution: {solution}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isCorrect === null && <Button onClick={checkAnswer}>Submit</Button>}
        {isCorrect !== null && <Button onClick={onNext}>Next</Button>}
        {isCorrect && <p className="text-green-500">Correct!</p>}
        {isCorrect === false && <p className="text-red-500">Incorrect. The correct answer was {question.a}</p>}
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState('idle');
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setShowSolution(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(generateQuestion());
    setTimeLeft(60);
    setScore(0);
    setShowSolution(false);
  };

  const stopGame = () => {
    setGameState('idle');
    setCurrentQuestion(null);
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(prevScore => prevScore + 1);
    setShowSolution(true);
  };

  const nextQuestion = () => {
    setCurrentQuestion(generateQuestion());
    setTimeLeft(60);
    setShowSolution(false);
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      {gameState === 'idle' ? (
        <Button onClick={startGame}>Start</Button>
      ) : (
        <>
          <QuestionCard 
            question={currentQuestion} 
            onAnswer={handleAnswer} 
            timeLeft={timeLeft} 
            onNext={nextQuestion} 
            showSolution={showSolution}
            solution={`Work through BODMAS: ${currentQuestion.q} = ${currentQuestion.a}`}
          />
          <Button className="mt-4" onClick={stopGame}>Stop</Button>
          <p className="mt-4">Score: {score}</p>
        </>
      )}
    </div>
  );
}
