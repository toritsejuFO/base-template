import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const generateRandomText = () => {
  const words = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she"
  ];
  const length = Math.floor(Math.random() * (50 - 15 + 1)) + 15;
  return Array.from({ length }, () => words[Math.floor(Math.random() * words.length)]).join(" ");
};

const TypingTest = () => {
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    setText(generateRandomText());
  }, []);

  const handleStart = () => {
    setIsStarted(true);
    setStartTime(Date.now());
    setUserInput("");
    setMistakes(0);
  };

  const handleReset = () => {
    setIsStarted(false);
    setStartTime(null);
    setEndTime(null);
    setUserInput("");
    setMistakes(0);
    setText(generateRandomText());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (value.length > userInput.length) {
      const lastChar = value[value.length - 1];
      const correctChar = text[value.length - 1];
      if (lastChar !== correctChar) {
        setMistakes((prev) => prev + 1);
      }
    }

    if (value.length === text.length) {
      setEndTime(Date.now());
    }
  };

  const getCharClass = useCallback((index) => {
    if (index >= userInput.length) return "text-gray-400";
    return userInput[index] === text[index] ? "text-green-500" : "text-red-500";
  }, [userInput, text]);

  const calculateScore = () => {
    const correctChars = userInput.split("").filter((char, index) => char === text[index]).length;
    const totalChars = text.length;
    return Math.round((correctChars / totalChars) * 100);
  };

  const calculateWordScore = () => {
    const userWords = userInput.trim().split(" ");
    const correctWords = text.trim().split(" ");
    const correctCount = userWords.filter((word, index) => word === correctWords[index]).length;
    return Math.round((correctCount / correctWords.length) * 100);
  };

  const calculateWPM = () => {
    const timeInMinutes = (endTime - startTime) / 60000;
    const words = userInput.trim().split(" ").length;
    return Math.round(words / timeInMinutes);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Typing Speed Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-md">
            {text.split("").map((char, index) => (
              <span key={index} className={getCharClass(index)}>
                {char}
              </span>
            ))}
          </div>
          <Textarea
            value={userInput}
            onChange={handleInputChange}
            disabled={!isStarted || endTime}
            placeholder="Start typing here..."
            className="w-full h-32"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          {!isStarted && (
            <Button onClick={handleStart}>Start</Button>
          )}
          {isStarted && !endTime && (
            <div>Typing...</div>
          )}
          {endTime && (
            <div className="space-y-2">
              <p>Character Score: {calculateScore()}%</p>
              <p>Word Score: {calculateWordScore()}%</p>
              <p>WPM: {calculateWPM()}</p>
              <p>Mistakes: {mistakes}</p>
            </div>
          )}
          <Button onClick={handleReset}>Reset</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default function App() {
  return <TypingTest />;
}
