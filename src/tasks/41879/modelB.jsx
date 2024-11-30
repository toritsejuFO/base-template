import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for songs
const songs = [
  { title: "Jingle Bells", notes: ["mi", "mi", "mi", "mi", "mi", "mi", "mi", "sol", "do", "re", "mi", "fa", "fa", "fa", "mi", "re", "do", "re", "mi", "mi", "re", "re", "mi", "sol", "fa", "mi", "do", "do", "re", "mi", "fa", "sol"] },
  { title: "Silent Night", notes: ["sol", "mi", "fa", "re", "re", "sol", "mi", "fa", "re", "re", "sol", "la", "sol", "fa", "mi", "re", "sol", "la", "sol", "fa", "mi", "re", "do", "re", "mi", "fa", "sol", "sol", "sol", "fa", "mi", "re", "do"] },
  // Add more songs here, at least 10 in total
];

// Piano Key component
const PianoKey = ({ note, isActive, onClick }) => (
  <button 
    className={`w-8 h-24 m-1 rounded ${isActive ? 'bg-blue-500' : 'bg-white'} border border-gray-300 hover:bg-gray-100`}
    onClick={() => onClick(note)}
  >
    {note}
  </button>
);

// Main App component
export default function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [audioContext, setAudioContext] = useState(null);
  const [oscillator, setOscillator] = useState(null);

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      setAudioContext(new AudioContext());
    }
  }, []);

  const playNote = (note) => {
    if (!audioContext) return;

    const freq = {
      'do': 261.63, 're': 293.66, 'mi': 329.63, 'fa': 349.23,
      'sol': 392.00, 'la': 440.00, 'ti': 493.88
    }[note] || 0;

    const o = audioContext.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, audioContext.currentTime);
    o.connect(audioContext.destination);
    o.start();
    o.stop(audioContext.currentTime + 0.5);
    setOscillator(o);
  };

  const playSong = () => {
    if (!selectedSong || !audioContext) return;
    if (playing) {
      setPlaying(false);
      if (oscillator) oscillator.stop();
      return;
    }

    setPlaying(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < selectedSong.notes.length && playing) {
        playNote(selectedSong.notes[index]);
        setCurrentNoteIndex(index);
        index++;
      } else {
        clearInterval(interval);
        setPlaying(false);
        setCurrentNoteIndex(0);
      }
    }, 500);
  };

  const stopSong = () => {
    setPlaying(false);
    setCurrentNoteIndex(0);
    if (oscillator) oscillator.stop();
  };

  const keyboardNotes = ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti', 'do', 're', 'mi', 'fa', 'sol'];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Christmas Songs Player</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-40 mb-4">
            {songs.map((song, index) => (
              <div key={index} onClick={() => setSelectedSong(song)} 
                   className={`cursor-pointer p-2 border-b last:border-b-0 ${selectedSong === song ? 'bg-blue-100' : ''}`}>
                {song.title}
              </div>
            ))}
          </ScrollArea>
          <div className="flex space-x-2 mb-4">
            <Button onClick={playSong}>{playing ? 'Pause' : 'Play'}</Button>
            <Button onClick={stopSong}>Stop</Button>
          </div>
          <div className="flex flex-wrap justify-center">
            {keyboardNotes.map((note, idx) => (
              <PianoKey 
                key={idx}
                note={note} 
                isActive={selectedSong && playing && selectedSong.notes[currentNoteIndex] === note}
                onClick={() => playNote(note)}
              />
            ))}
          </div>
          {selectedSong && playing && (
            <div className="mt-4 text-center">
              <div>Playing: {selectedSong.notes[currentNoteIndex]}</div>
              <div>Key: {keyboardNotes[currentNoteIndex % 12]}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
