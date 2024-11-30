import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Pause, Play, RotateCcw, Settings, Sun, Moon } from "lucide-react";

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function Timer({ time, isBreak }) {
  return (
    <div className="text-4xl font-bold mb-4">
      {formatTime(time)}
      <span className="text-sm ml-2">{isBreak ? "Break" : "Focus"}</span>
    </div>
  );
}

function Controls({ isRunning, onStart, onPause, onStop, onSkip }) {
  return (
    <div className="flex space-x-2 mb-4">
      <Button onClick={isRunning ? onPause : onStart}>
        {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
        {isRunning ? "Pause" : "Start"}
      </Button>
      <Button onClick={onStop} variant="destructive">
        <RotateCcw className="mr-2 h-4 w-4" />
        Stop
      </Button>
      <Button onClick={onSkip} variant="outline">
        Skip
      </Button>
    </div>
  );
}

function SettingsPanel({ autoStart, setAutoStart, darkMode, setDarkMode }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-start">Auto-start next session</Label>
          <Switch
            id="auto-start"
            checked={autoStart}
            onCheckedChange={setAutoStart}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [time, setTime] = useState(FOCUS_TIME);
  const [isBreak, setIsBreak] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [autoStart, setAutoStart] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      if (isBreak) {
        setSessions((prev) => prev + 1);
      }
      notify();
      if (autoStart) {
        setIsBreak((prev) => !prev);
        setTime(isBreak ? FOCUS_TIME : BREAK_TIME);
      } else {
        setIsRunning(false);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, time, isBreak, autoStart]);

  const notify = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(isBreak ? "Break time is over!" : "Focus time is over!");
    }
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setTime(isBreak ? BREAK_TIME : FOCUS_TIME);
  };
  const handleSkip = () => {
    setIsBreak((prev) => !prev);
    setTime(isBreak ? FOCUS_TIME : BREAK_TIME);
    setIsRunning(false);
  };

  const adjustTime = (amount) => {
    setTime((prevTime) => Math.max(60, prevTime + amount));
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="container mx-auto p-4 max-w-md">
        <Card className={darkMode ? "bg-gray-800" : ""}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Productivity Timer</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Timer time={time} isBreak={isBreak} />
            <Controls
              isRunning={isRunning}
              onStart={handleStart}
              onPause={handlePause}
              onStop={handleStop}
              onSkip={handleSkip}
            />
            <div className="flex justify-between items-center mb-4">
              <Button onClick={() => adjustTime(-60)} variant="outline">-1 min</Button>
              <span>Adjust Time</span>
              <Button onClick={() => adjustTime(60)} variant="outline">+1 min</Button>
            </div>
            <div className="text-center">
              <p>Completed Sessions: {sessions}</p>
            </div>
          </CardContent>
        </Card>
        {showSettings && (
          <SettingsPanel
            autoStart={autoStart}
            setAutoStart={setAutoStart}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        )}
      </div>
    </div>
  );
}
