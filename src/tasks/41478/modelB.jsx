import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const questions = [
  {
    question: "What is 8 + (3 × 4) - 5?",
    answer: 15,
    explanation: "Following BODMAS: 3 × 4 = 12, then 8 + 12 = 20, finally 20 - 5 = 15"
  },
  {
    question: "Simplify: 2x + 3y - (4x - 5y)",
    answer: "-2x + 8y",
    explanation: "Distribute the negative: 2x + 3y - 4x + 5y, then combine like terms: -2x + 8y"
  },
  {
    question: "What is the square root of 144?",
    answer: 12,
    explanation: "12 × 12 = 144"
  },
  {
    question: "Solve for x: 3x + 7 = 22",
    answer: 5,
    explanation: "Subtract 7 from both sides: 3x = 15, then divide by 3: x = 5"
  },
  {
    question: "What is 20% of 80?",
    answer: 16,
    explanation: "20% = 0.2, so 0.2 × 80 = 16"
  }
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function App() {
  const [gameState, setGameState] = useState("idle");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    let timer;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      handleAnswer();
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState("playing");
    setCurrentQuestion(0);
    setScore(0);
    setShuffledQuestions(shuffleArray([...questions]));
    setTimeLeft(60);
    setShowExplanation(false);
  };

  const stopGame = () => {
    setGameState("idle");
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswer("");
    setTimeLeft(60);
    setShowExplanation(false);
  };

  const handleAnswer = () => {
    const currentQ = shuffledQuestions[currentQuestion];
    if (userAnswer.toString() === currentQ.answer.toString()) {
      setScore(score + 1);
    }
    setShowExplanation(true);
    setGameState("review");
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer("");
      setTimeLeft(60);
      setShowExplanation(false);
      setGameState("playing");
    } else {
      stopGame();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Math Challenge</CardTitle>
        </CardHeader>
        <CardContent>
          {gameState === "idle" && (
            <Button onClick={startGame} className="w-full">
              Start Game
            </Button>
          )}
          {gameState !== "idle" && (
            <>
              <div className="mb-4 text-center">
                <p>Score: {score}</p>
                <p>Time Left: {timeLeft}s</p>
              </div>
              <p className="text-lg font-semibold mb-4">
                {shuffledQuestions[currentQuestion]?.question}
              </p>
              {!showExplanation && (
                <Input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer"
                  className="mb-4"
                />
              )}
              {showExplanation && (
                <div className="mb-4">
                  <p>Correct Answer: {shuffledQuestions[currentQuestion]?.answer}</p>
                  <p>Explanation: {shuffledQuestions[currentQuestion]?.explanation}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {gameState !== "idle" && (
            <>
              {!showExplanation && (
                <Button onClick={handleAnswer} disabled={gameState !== "playing"}>
                  Submit
                </Button>
              )}
              {showExplanation && <Button onClick={nextQuestion}>Next</Button>}
              <Button onClick={stopGame} variant="outline">
                Stop Game
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
