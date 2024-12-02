import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialMoods = ["Happy", "Sad", "Excited", "Anxious", "Calm", "Angry"];
const timeSlots = ["Morning", "Afternoon", "Evening", "Night"];

export default function App() {
  const [moods, setMoods] = useState(initialMoods);
  const [newMood, setNewMood] = useState("");
  const [logs, setLogs] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("Morning");
  const [selectedMood, setSelectedMood] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const today = new Date();
    const pastWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    setLogs(
      pastWeek.map((date) => ({
        date,
        Morning: "",
        Afternoon: "",
        Evening: "",
        Night: "",
      }))
    );
  }, []);

  const handleAddMood = () => {
    if (newMood && !moods.includes(newMood)) {
      setMoods([...moods, newMood]);
      setNewMood("");
    }
  };

  const handleDeleteMood = (mood) => {
    const moodUsed = logs.some((log) =>
      Object.values(log).some((value) => value === mood)
    );
    if (moodUsed) {
      setError("Cannot delete a mood that has been logged.");
    } else {
      setMoods(moods.filter((m) => m !== mood));
    }
  };

  const handleLogMood = () => {
    if (selectedMood) {
      const today = new Date().toISOString().split("T")[0];
      setLogs(
        logs.map((log) =>
          log.date === today
            ? { ...log, [selectedTimeSlot]: selectedMood }
            : log
        )
      );
      setSelectedMood("");
    }
  };

  const getTopMoods = () => {
    const moodCounts = {};
    logs.forEach((log) => {
      Object.values(log).forEach((mood) => {
        if (mood && mood !== "date") {
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        }
      });
    });
    return Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([mood]) => mood);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Mood Tracker</h1>
      <Tabs defaultValue="log">
        <TabsList className="mb-4">
          <TabsTrigger value="log">Log Mood</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="manage">Manage Moods</TabsTrigger>
        </TabsList>
        <TabsContent value="log">
          <Card>
            <CardHeader>
              <CardTitle>Log Your Mood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Select onValueChange={setSelectedTimeSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setSelectedMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent>
                    {moods.map((mood) => (
                      <SelectItem key={mood} value={mood}>
                        {mood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleLogMood}>Log Mood</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold mb-2">Weekly Trend</h3>
                  {logs.map((log) => (
                    <div key={log.date} className="flex justify-between">
                      <span>{log.date}</span>
                      <span>{log[selectedTimeSlot] || "-"}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-bold mb-2">Top 3 Moods</h3>
                  <ul>
                    {getTopMoods().map((mood) => (
                      <li key={mood}>{mood}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Moods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newMood}
                    onChange={(e) => setNewMood(e.target.value)}
                    placeholder="New mood"
                  />
                  <Button onClick={handleAddMood}>Add</Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {moods.map((mood) => (
                    <div key={mood} className="flex justify-between items-center">
                      <span>{mood}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMood(mood)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
