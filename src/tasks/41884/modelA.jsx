import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function WordCounter() {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState("");
  const [wpm, setWpm] = useState(0);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const evaluateText = () => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const characters = text.length;
    const randomWpm = Math.floor(Math.random() * (250 - 200 + 1) + 200);
    const timeInMinutes = words.length / randomWpm;
    const minutes = Math.floor(timeInMinutes);
    const seconds = Math.round((timeInMinutes - minutes) * 60);

    setWordCount(words.length);
    setCharCount(characters);
    setReadingTime(`${minutes} min ${seconds} sec`);
    setWpm(randomWpm);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Word Counter App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your text here..."
            className="w-full h-40 mb-4"
            value={text}
            onChange={handleTextChange}
          />
          <Button
            onClick={evaluateText}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Evaluate
          </Button>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard title="Word Count" value={wordCount} />
            <ResultCard title="Character Count" value={charCount} />
            <ResultCard title="Reading Time" value={readingTime} />
            <ResultCard title="Assumed WPM" value={wpm} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResultCard({ title, value }) {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return <WordCounter />;
}
