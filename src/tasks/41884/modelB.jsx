import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function WordCounter() {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState({ min: 0, max: 0 });
  const [wpm, setWpm] = useState(0);

  useEffect(() => {
    // Random WPM between 200 and 250
    const randomWpm = Math.floor(Math.random() * (250 - 200 + 1)) + 200;
    setWpm(randomWpm);
  }, []);

  const countWordsAndChars = () => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const chars = text.replace(/\s/g, '').length;

    setWordCount(words.length);
    setCharCount(chars);
    
    // Calculate reading time
    const minutesMin = Math.ceil(words.length / wpm);
    const minutesMax = Math.ceil(words.length / 200);
    setReadingTime({ min: minutesMin, max: minutesMax });
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle>Word Counter</CardTitle>
        <CardDescription>Paste your text to analyze.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input 
            as="textarea" 
            rows={6} 
            placeholder="Paste your text here..." 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            className="resize-none"
          />
          <Button onClick={countWordsAndChars}>Evaluate</Button>
          {wordCount > 0 && (
            <div className="space-y-2">
              <p>Word Count: {wordCount}</p>
              <p>Character Count: {charCount}</p>
              <p>Reading Time: {readingTime.min} - {readingTime.max} minutes at {wpm} WPM</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full space-y-8">
        <WordCounter />
      </div>
    </div>
  );
}
