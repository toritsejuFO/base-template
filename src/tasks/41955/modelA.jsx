import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils";

const beepSound = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5EIf0VQQAQhAAACnAAABSAFQAO4UAQAADAAAABiDAwEDAAAAGwF1xg4MIgiAQAAoCIAAKCA4AAAFYxO3R2AgAAAAAAAAAA//8AAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRFw8ZCIacZH90GxfDqsHErMazgABekNMo1aqAAI0o3D45AAAADBRHgEAAABDaAMAAAABRoAMAAAABNAAAABAAIAAAFnAAIAAACF');

function Timer() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [isCountdown, setIsCountdown] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime(prevTime => isCountdown ? Math.max(prevTime - 10, 0) : prevTime + 10);
      }, 10);
    } else if (!running && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, time, isCountdown]);

  const startPause = () => {
    if (isCountdown && time === 0) return;
    setRunning(!running);
  };

  const stop = () => {
    setRunning(false);
    setTime(isCountdown ? initialTime : 0);
    setLaps([]);
  };

  const recordLap = () => {
    if (running) {
      setLaps([time, ...laps]);
      if (!isCountdown) beepSound.play();
    }
  };

  const handleTimeChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setInitialTime(value * 1000);
    if (!running) setTime(value * 1000);
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const toggleMode = () => {
    setIsCountdown(!isCountdown);
    stop();
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={cn("min-h-screen flex flex-col items-center justify-center", darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800")}>
      <Card className="w-full max-w-sm p-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl mb-4">Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl text-center mb-4">
            {formatTime(time)}
          </div>
          <div className="flex justify-between mb-4">
            <Button onClick={startPause}>{running ? 'Pause' : 'Start'}</Button>
            <Button onClick={stop}>Stop</Button>
            <Button onClick={recordLap}>Lap</Button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <Label htmlFor="time">Set Time (sec)</Label>
            <Input 
              id="time" 
              type="number" 
              value={time / 1000} 
              onChange={handleTimeChange} 
              disabled={running} 
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <Label>Mode:</Label>
            <Switch onCheckedChange={toggleMode} checked={isCountdown} />
            <Label>{isCountdown ? 'Countdown' : 'Stopwatch'}</Label>
          </div>
          <div className="flex items-center justify-between">
            <Label>Dark Mode:</Label>
            <Switch onCheckedChange={toggleDarkMode} checked={darkMode} />
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 w-full max-w-sm">
        {laps.map((lap, index) => (
          <Card key={index} className="mb-2">
            <CardContent>
              <p>Lap {laps.length - index}: {formatTime(lap)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {isCountdown && time === 0 && beepSound.play()}
    </div>
  );
}

export default function App() {
  return <Timer />;
}
