import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const words = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(' ');

function generateRandomText() {
  const length = Math.floor(Math.random() * (50 - 15 + 1)) + 15;
  return Array.from({length}, () => words[Math.floor(Math.random() * words.length)]).join(' ');
}

function TypingTest() {
  const [text, setText] = useState(generateRandomText());
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isStarted && !startTime) {
      setStartTime(Date.now());
      inputRef.current.focus();
    }
  }, [isStarted, startTime]);

  const handleInputChange = (e) => {
    if (!isStarted) return;
    const input = e.target.value;
    setUserInput(input);

    if (input.length > userInput.length) {
      if (input[input.length - 1] !== text[input.length - 1]) {
        setMistakes(mistakes => mistakes + 1);
      }
    }
  };

  const timeTaken = startTime ? (Date.now() - startTime) / 1000 : 0;
  const wordsTyped = userInput.trim().split(/\s+/).length;
  const wpm = timeTaken ? Math.round((wordsTyped / timeTaken) * 60) : 0;

  const resetTest = () => {
    setText(generateRandomText());
    setUserInput('');
    setStartTime(null);
    setMistakes(0);
    setIsStarted(false);
  };

  const endTest = text.length === userInput.length;

  return (
    <Card className="sm:max-w-lg mx-auto mt-10 p-4">
      <CardHeader>
        <CardTitle>Typing Speed Test</CardTitle>
      </CardHeader>
      <CardContent>
        <textarea 
          value={text} 
          readOnly 
          className="w-full h-24 mb-4 p-2 border border-gray-300 rounded bg-gray-100"
        />
        <textarea 
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          className="w-full h-24 p-2 border border-gray-300 rounded"
          style={{
            backgroundColor: 'white',
            color: 'black',
          }}
        />
        <div className="mt-2">
          {Array.from(userInput).map((char, idx) => (
            <span key={idx} style={{ color: char === text[idx] ? 'green' : 'red' }}>
              {char}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isStarted ? 
          <Button onClick={() => setIsStarted(true)}>Start</Button> :
          <div>
            <p>Time: {timeTaken.toFixed(2)}s</p>
            <p>Mistakes: {mistakes}</p>
            <p>WPM: {wpm}</p>
            {endTest && <p>Score: {((text.length - mistakes) / text.length * 100).toFixed(2)}%</p>}
          </div>
        }
        <Button onClick={resetTest}>Reset</Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <TypingTest />
    </div>
  );
}
