import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const christmasSongs = [
  {
    title: "Jingle Bells",
    notes: ["E", "E", "E", "E", "E", "E", "E", "G", "C", "D", "E"],
    solfa: ["Mi", "Mi", "Mi", "Mi", "Mi", "Mi", "Mi", "So", "Do", "Re", "Mi"],
  },
  {
    title: "Silent Night",
    notes: ["G", "A", "G", "E", "G", "A", "G", "E", "D", "D", "B"],
    solfa: ["So", "La", "So", "Mi", "So", "La", "So", "Mi", "Re", "Re", "Ti"],
  },
  {
    title: "Deck the Halls",
    notes: ["D", "C", "B", "A", "G", "A", "B", "G", "A", "B", "C", "A", "B"],
    solfa: ["Re", "Do", "Ti", "La", "So", "La", "Ti", "So", "La", "Ti", "Do", "La", "Ti"],
  },
  {
    title: "Rudolph the Red-Nosed Reindeer",
    notes: ["G", "A", "G", "E", "C", "D", "E", "F", "G", "A", "B", "C"],
    solfa: ["So", "La", "So", "Mi", "Do", "Re", "Mi", "Fa", "So", "La", "Ti", "Do"],
  },
  {
    title: "We Wish You a Merry Christmas",
    notes: ["D", "G", "G", "A", "G", "F#", "E", "E", "E", "A", "A", "B", "A", "G", "F#", "D"],
    solfa: ["Re", "So", "So", "La", "So", "Fi", "Mi", "Mi", "Mi", "La", "La", "Ti", "La", "So", "Fi", "Re"],
  },
  {
    title: "Frosty the Snowman",
    notes: ["G", "C", "C", "C", "B", "A", "G", "D", "G", "G", "G", "C", "E", "F", "G"],
    solfa: ["So", "Do", "Do", "Do", "Ti", "La", "So", "Re", "So", "So", "So", "Do", "Mi", "Fa", "So"],
  },
  {
    title: "Santa Claus Is Coming to Town",
    notes: ["C", "F", "F", "G", "F", "E", "D", "D", "G", "G", "A", "G", "F", "E", "C"],
    solfa: ["Do", "Fa", "Fa", "So", "Fa", "Mi", "Re", "Re", "So", "So", "La", "So", "Fa", "Mi", "Do"],
  },
  {
    title: "O Christmas Tree",
    notes: ["C", "F", "F", "F", "G", "A", "A", "A", "G", "F", "G", "C"],
    solfa: ["Do", "Fa", "Fa", "Fa", "So", "La", "La", "La", "So", "Fa", "So", "Do"],
  },
  {
    title: "The First Noel",
    notes: ["E", "D", "C", "D", "E", "F", "G", "A", "B", "C"],
    solfa: ["Mi", "Re", "Do", "Re", "Mi", "Fa", "So", "La", "Ti", "Do"],
  },
  {
    title: "Jingle Bell Rock",
    notes: ["D", "E", "F#", "B", "A", "G", "D", "E", "F#", "B", "A", "G"],
    solfa: ["Re", "Mi", "Fi", "Ti", "La", "So", "Re", "Mi", "Fi", "Ti", "La", "So"],
  },
];

const Keyboard = ({ currentNote }) => {
  const keys = ["C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B"];
  return (
    <div className="flex justify-center mb-4">
      {keys.map((key, index) => (
        <div
          key={index}
          className={`w-8 h-24 border border-gray-300 flex items-end justify-center pb-1 ${
            key === currentNote ? "bg-blue-500 text-white" : "bg-white"
          } ${key.includes("#") ? "bg-black text-white" : ""}`}
        >
          {key}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [audioContext, setAudioContext] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  const oscillatorRef = useRef(null);

  useEffect(() => {
    if (hasPermission) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(context);
    }
  }, [hasPermission]);

  useEffect(() => {
    if (isPlaying && selectedSong) {
      const playNote = () => {
        if (currentNoteIndex < selectedSong.notes.length) {
          const frequency = noteToFrequency(selectedSong.notes[currentNoteIndex]);
          playTone(frequency);
          setCurrentNoteIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          setCurrentNoteIndex(0);
        }
      };

      const timer = setTimeout(playNote, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentNoteIndex, selectedSong]);

  const noteToFrequency = (note) => {
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const octave = 4;
    const baseFrequency = 440;
    const semitones = notes.indexOf(note) - notes.indexOf("A") + (octave - 4) * 12;
    return baseFrequency * Math.pow(2, semitones / 12);
  };

  const playTone = (frequency) => {
    if (oscillatorRef.current) {
      oscillatorRef.current.disconnect();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);

    oscillatorRef.current = oscillator;
  };

  const handlePlay = () => {
    if (!hasPermission) {
      requestPermission();
    } else {
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentNoteIndex(0);
  };

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
    } catch (err) {
      console.error("Error requesting audio permission:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Christmas Music Player</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Select a Song</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setSelectedSong(christmasSongs.find((song) => song.title === value))}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a song" />
            </SelectTrigger>
            <SelectContent>
              {christmasSongs.map((song) => (
                <SelectItem key={song.title} value={song.title}>
                  {song.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Keyboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Keyboard currentNote={selectedSong && isPlaying ? selectedSong.notes[currentNoteIndex] : null} />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Playback Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button onClick={handlePlay} disabled={!selectedSong || isPlaying}>
              Play
            </Button>
            <Button onClick={handlePause} disabled={!isPlaying}>
              Pause
            </Button>
            <Button onClick={handleStop} disabled={!isPlaying}>
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedSong && isPlaying && (
        <Card>
          <CardHeader>
            <CardTitle>Now Playing: {selectedSong.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Current Note: {selectedSong.notes[currentNoteIndex]}</p>
            <p>Solfa: {selectedSong.solfa[currentNoteIndex]}</p>
          </CardContent>
        </Card>
      )}

      {!hasPermission && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p>Please allow audio permission to use this app.</p>
          <Button onClick={requestPermission} className="mt-2">
            Request Permission
          </Button>
        </div>
      )}
    </div>
  );
}
