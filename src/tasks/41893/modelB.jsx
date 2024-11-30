import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [autoStart, setAutoStart] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [focusExtension, setFocusExtension] = useState(0);
  const [breakExtension, setBreakExtension] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      if (isBreak) {
        setSessionsCompleted(prev => prev + 1);
        if (autoStart) startFocus();
      } else {
        if (autoStart) startBreak();
        else setIsRunning(false);
      }
      new Notification(isBreak ? "Break Over!" : "Focus Time Over!");
    }

    return () => clearInterval(intervalRef.current);
  }, [timeLeft, isRunning, isBreak, autoStart]);

  const startFocus = () => {
    setIsRunning(true);
    setIsBreak(false);
    setTimeLeft((25 + focusExtension) * 60);
  };

  const startBreak = () => {
    setIsRunning(true);
    setIsBreak(true);
    setTimeLeft((5 + breakExtension) * 60);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setIsBreak(false);
    clearInterval(intervalRef.current);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Card className="w-full max-w-sm p-4 sm:p-6">
        <CardHeader>
          <CardTitle>Productivity Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-4xl text-center mb-4">{formatTime(timeLeft)}</div>
          <div className="flex justify-between">
            <Button onClick={isRunning ? pauseTimer : startFocus}>{isRunning ? "Pause" : "Start Focus"}</Button>
            {isRunning && <Button variant="destructive" onClick={stopTimer}>Stop</Button>}
          </div>
          {!isRunning && (
            <>
              <div className="flex justify-between items-center">
                <label>Focus Extension:</label>
                <Input type="number" value={focusExtension} onChange={e => setFocusExtension(Number(e.target.value))} className="w-20" />
              </div>
              <div className="flex justify-between items-center">
                <label>Break Extension:</label>
                <Input type="number" value={breakExtension} onChange={e => setBreakExtension(Number(e.target.value))} className="w-20" />
              </div>
            </>
          )}
          <div className="flex items-center justify-between">
            <label>Auto Start Next Session:</label>
            <Switch checked={autoStart} onCheckedChange={setAutoStart} />
          </div>
          <div className="flex items-center justify-between">
            <label>Dark Mode:</label>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
          <p>Completed Sessions: {sessionsCompleted}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
