import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const birthdayWishes = [
  "May your day be filled with laughter and love!",
  "Wishing you a fantastic birthday and a year full of adventures!",
  "Here's to another year of amazing experiences!",
  "Happy Birthday! May all your dreams come true!",
  "Celebrate and enjoy your special day to the fullest!"
];

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }

  if (days < 0) {
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthLastDay;
    months--;
  }

  return { years, months, days };
}

function calculateDaysLived(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  const diffTime = Math.abs(today - birth);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateLeapYears(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let leapYears = 0;

  for (let year = birth.getFullYear(); year <= today.getFullYear(); year++) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      leapYears++;
    }
  }

  return leapYears;
}

function BirthdayCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState(null);
  const [daysLived, setDaysLived] = useState(0);
  const [leapYears, setLeapYears] = useState(0);
  const [monthsLived, setMonthsLived] = useState(0);
  const [wish, setWish] = useState("");

  useEffect(() => {
    if (birthDate) {
      const calculatedAge = calculateAge(birthDate);
      setAge(calculatedAge);
      setDaysLived(calculateDaysLived(birthDate));
      setLeapYears(calculateLeapYears(birthDate));
      setMonthsLived(calculatedAge.years * 12 + calculatedAge.months);
      setWish(birthdayWishes[Math.floor(Math.random() * birthdayWishes.length)]);
    }
  }, [birthDate]);

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Birthday Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="birthday">Your Birthday</Label>
            <Input
              id="birthday"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full"
            />
          </div>
          {age && (
            <div className="space-y-2">
              <p className="text-lg font-semibold">Age: {age.years} years, {age.months} months, and {age.days} days</p>
              <p>Days lived: {daysLived}</p>
              <p>Leap years: {leapYears}</p>
              <p>Months lived: {monthsLived}</p>
              <p className="italic text-gray-600">{wish}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <BirthdayCalculator />
    </div>
  );
}
