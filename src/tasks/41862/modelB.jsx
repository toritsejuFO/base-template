import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function jaroSimilarity(s1, s2) {
  if (s1 === s2) return 1.0;

  const len1 = s1.length, len2 = s2.length;
  const matchDistance = Math.max(len1, len2) / 2 - 1;
  
  const s1Matches = new Array(len1).fill(false);
  const s2Matches = new Array(len2).fill(false);
  
  let matches = 0;
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(len2, i + matchDistance + 1);
    
    for (let j = start; j < end; j++) {
      if (s2Matches[j]) continue;
      if (s1[i] === s2[j]) {
        s1Matches[i] = true;
        s2Matches[j] = true;
        matches++;
        break;
      }
    }
  }

  if (matches === 0) return 0.0;

  let transpositions = 0;
  let point = 0;
  for (let i = 0; i < len1; i++) {
    if (s1Matches[i]) {
      while (!s2Matches[point]) point++;
      if (s1[i] !== s2[point]) transpositions++;
      point++;
    }
  }
  transpositions /= 2;

  return (matches / len1 + matches / len2 + (matches - transpositions) / matches) / 3.0;
}

function JaroExplanation({ s1, s2, similarity }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Jaro Similarity Explanation</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Similarity between "{s1}" and "{s2}" is {similarity.toFixed(3)}</p>
        <p>Explanation:</p>
        <ul className="list-disc pl-5">
          <li>Matching characters: Characters that match within the matching distance.</li>
          <li>Transpositions: Number of matching characters that are not in the same sequence, divided by 2.</li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [similarity, setSimilarity] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleEvaluate = () => {
    const result = jaroSimilarity(text1, text2);
    setSimilarity(result);
    setShowExplanation(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm sm:max-w-lg p-4">
        <CardHeader>
          <CardTitle>Jaro Similarity Checker</CardTitle>
          <CardDescription>Enter two strings to compare their similarity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            label="Text 1" 
            value={text1} 
            onChange={(e) => setText1(e.target.value)} 
            placeholder="Enter first text"
          />
          <Input 
            label="Text 2" 
            value={text2} 
            onChange={(e) => setText2(e.target.value)} 
            placeholder="Enter second text"
          />
          <Button onClick={handleEvaluate}>Evaluate</Button>
          {similarity !== null && (
            <div className="text-center">
              <p className="text-xl font-bold">Similarity Score: {similarity.toFixed(3)}</p>
            </div>
          )}
          {showExplanation && similarity !== null && (
            <JaroExplanation s1={text1} s2={text2} similarity={similarity} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
