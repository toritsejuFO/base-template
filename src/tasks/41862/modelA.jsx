import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function jaroSimilarity(s1, s2) {
  if (s1 === s2) return 1.0;

  const len1 = s1.length;
  const len2 = s2.length;

  const maxDist = Math.floor(Math.max(len1, len2) / 2) - 1;

  let match = 0;
  let hash_s1 = new Array(s1.length).fill(0);
  let hash_s2 = new Array(s2.length).fill(0);

  for (let i = 0; i < len1; i++) {
    for (let j = Math.max(0, i - maxDist); j < Math.min(len2, i + maxDist + 1); j++) {
      if (s1[i] === s2[j] && hash_s2[j] === 0) {
        hash_s1[i] = 1;
        hash_s2[j] = 1;
        match++;
        break;
      }
    }
  }

  if (match === 0) return 0.0;

  let t = 0;
  let point = 0;

  for (let i = 0; i < len1; i++) {
    if (hash_s1[i] === 1) {
      while (hash_s2[point] === 0) point++;
      if (s1[i] !== s2[point++]) t++;
    }
  }

  t /= 2;

  return ((match / len1 + match / len2 + (match - t) / match) / 3).toFixed(4);
}

function JaroSimilarityCalculator() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [similarity, setSimilarity] = useState(null);

  const handleEvaluate = () => {
    const score = jaroSimilarity(text1, text2);
    setSimilarity(score);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Jaro Similarity Calculator</CardTitle>
        <CardDescription>Enter two texts to calculate their similarity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter first text"
          value={text1}
          onChange={(e) => setText1(e.target.value)}
        />
        <Input
          placeholder="Enter second text"
          value={text2}
          onChange={(e) => setText2(e.target.value)}
        />
        <Button onClick={handleEvaluate} className="w-full">
          Evaluate
        </Button>
        {similarity !== null && (
          <div className="text-center">
            <p className="text-lg font-semibold">Similarity Score: {similarity}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How it works</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm">
                The Jaro similarity algorithm calculates the similarity between two strings. It considers the number of matching characters and their positions. The score ranges from 0 (completely different) to 1 (identical).
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <JaroSimilarityCalculator />
    </div>
  );
}
