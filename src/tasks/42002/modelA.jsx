import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const defaultMoods = ['Happy', 'Sad', 'Excited', 'Tired', 'Anxious', 'Relaxed'];

function App() {
  const [moods, setMoods] = useState(defaultMoods);
  const [selectedMood, setSelectedMood] = useState('');
  const [newMood, setNewMood] = useState('');
  const [logs, setLogs] = useState(() => {
    const initialLogs = {};
    for(let day = 0; day < 7; day++) {
      initialLogs[day] = { morning: '', afternoon: '', evening: '', night: '' };
    }
    return initialLogs;
  });
  const [currentDay, setCurrentDay] = useState(0);

  const addMood = () => {
    if (newMood && !moods.includes(newMood)) {
      setMoods(prev => [...prev, newMood]);
      setSelectedMood(newMood);
      setNewMood('');
    }
  };

  const deleteMood = (moodToDelete) => {
    if (Object.values(logs).some(day => Object.values(day).includes(moodToDelete))) {
      alert("Cannot delete a mood that has been logged.");
      return;
    }
    setMoods(prev => prev.filter(mood => mood !== moodToDelete));
  };

  const logMood = (time, mood) => {
    setLogs(prev => ({
      ...prev,
      [currentDay]: { ...prev[currentDay], [time]: mood }
    }));
  };

  const getMoodFrequency = () => {
    const frequency = {};
    Object.values(logs).forEach(day => 
      Object.values(day).forEach(mood => {
        if (mood) frequency[mood] = (frequency[mood] || 0) + 1;
      })
    );
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([mood]) => mood);
  };

  const MoodList = () => (
    <div className="flex flex-col space-y-2">
      <Input 
        placeholder="Add new mood" 
        value={newMood} 
        onChange={(e) => setNewMood(e.target.value)} 
        onKeyPress={(e) => e.key === 'Enter' && addMood()}
      />
      <Button onClick={addMood}>Add Mood</Button>
      {moods.map(mood => (
        <div key={mood} className="flex justify-between items-center">
          <span>{mood}</span>
          <Button onClick={() => deleteMood(mood)} variant="destructive">Delete</Button>
        </div>
      ))}
    </div>
  );

  const MoodTracker = () => (
    <Card>
      <CardHeader>
        <CardTitle>Log Your Mood</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedMood} onChange={(e) => setSelectedMood(e.target.value)}>
          {moods.map(mood => <SelectItem key={mood} value={mood}>{mood}</SelectItem>)}
        </Select>
        <div className="mt-4 space-y-2">
          {['morning', 'afternoon', 'evening', 'night'].map(time => (
            <Button 
              key={time} 
              onClick={() => logMood(time, selectedMood)}
              className="w-full"
            >
              Log for {time}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const MoodTrend = () => {
    const trendData = Object.entries(logs).map(([day, times]) => ({
      day: `Day ${parseInt(day) + 1}`,
      ...times
    }));

    return (
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="morning">Morning</TabsTrigger>
          <TabsTrigger value="afternoon">Afternoon</TabsTrigger>
          <TabsTrigger value="evening">Evening</TabsTrigger>
          <TabsTrigger value="night">Night</TabsTrigger>
        </TabsList>
        {['all', 'morning', 'afternoon', 'evening', 'night'].map(time => (
          <TabsContent key={time} value={time}>
            {trendData.map((data, idx) => (
              <div key={idx} className="mb-2">
                {data.day}: {time === 'all' ? JSON.stringify(data) : data[time]}
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Tabs defaultValue="tracker">
        <TabsList>
          <TabsTrigger value="tracker">Tracker</TabsTrigger>
          <TabsTrigger value="moods">Moods</TabsTrigger>
          <TabsTrigger value="trend">Trend</TabsTrigger>
        </TabsList>
        <TabsContent value="tracker">
          <MoodTracker />
        </TabsContent>
        <TabsContent value="moods">
          <MoodList />
        </TabsContent>
        <TabsContent value="trend">
          <MoodTrend />
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Top Moods This Week</CardTitle>
            </CardHeader>
            <CardContent>
              {getMoodFrequency().map((mood, idx) => (
                <div key={idx}>{idx + 1}. {mood}</div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
