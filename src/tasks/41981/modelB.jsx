import React, { useState, useEffect } from 'react';
import { Input, Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function calculateDaysLived(birthday) {
  const today = new Date();
  const birthDate = new Date(birthday);
  let timeDiff = today.getTime() - birthDate.getTime();
  let daysLived = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  // Adjust for leap years
  const years = today.getFullYear() - birthDate.getFullYear();
  const leapYears = Math.floor(years / 4) - Math.floor(years / 100) + Math.floor(years / 400);
  daysLived += leapYears; // Add days for each leap year

  return { daysLived, leapYears };
}

const wishes = [
  "Happy Life Days! 🎉",
  "Another day, another adventure! 🌟",
  "You're like fine wine, getting better with time! 🍷",
  "Here's to more life, love, and laughter! 💖",
  "Keep shining, keep smiling! 😊"
];

function BirthdayApp() {
  const [birthday, setBirthday] = useState('');
  const [result, setResult] = useState(null);
  const [wish, setWish] = useState('');

  useEffect(() => {
    if (result) {
      setWish(wishes[Math.floor(Math.random() * wishes.length)]);
    }
  }, [result]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (birthday) {
      const { daysLived, leapYears } = calculateDaysLived(birthday);
      const monthsLived = Math.floor(daysLived / 30.44); // Average month length
      setResult({ daysLived, leapYears, monthsLived });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-4">
        <CardHeader>
          <CardTitle>Life Calculator</CardTitle>
          <CardDescription>Enter your birthday to see how many days you've lived!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Input 
              type="date" 
              value={birthday} 
              onChange={(e) => setBirthday(e.target.value)} 
              required 
            />
            <Button className="mt-4 w-full" type="submit">Calculate</Button>
          </form>
          {result && (
            <div className="mt-4 space-y-2">
              <p>You have lived for <strong>{result.daysLived} days</strong>.</p>
              <p>That's about <strong>{result.monthsLived} months</strong>.</p>
              <p>You've been through <strong>{result.leapYears} leap year{result.leapYears > 1 ? 's' : ''}</strong>.</p>
              <p className="text-xl text-center text-blue-600">{wish}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return <BirthdayApp />;
}
