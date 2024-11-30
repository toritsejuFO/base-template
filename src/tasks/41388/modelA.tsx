import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Slider } from "../../components/ui/slider";

const App: React.FC = () => {
  const [gridSizeN, setGridSizeN] = useState(2);
  const [gridSizeM, setGridSizeM] = useState(2);
  const [viewTime, setViewTime] = useState(3);
  const [gameState, setGameState] = useState<'idle' | 'viewing' | 'playing' | 'lost' | 'won'>('idle');
  const [colors, setColors] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [correctPairs, setCorrectPairs] = useState<number>(0);
  const [showCorrect, setShowCorrect] = useState(false);

  const generateColors = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98FB98', '#DDA0DD', '#87CEEB'];
    let gridColors: any[] = [];
    for (let i = 0; i < gridSizeN * gridSizeM / 2; i++) {
      gridColors.push(colors[i % colors.length], colors[i % colors.length]);
    }
    return gridColors.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    setColors(generateColors());
    setSelected([]);
    setCorrectPairs(0);
    setGameState('viewing');
    setTimeout(() => setGameState('playing'), viewTime * 1000);
  };

  const handleCellClick = (index: number) => {
    if (gameState !== 'playing' || selected.includes(index)) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      if (colors[newSelected[0]] === colors[newSelected[1]]) {
        setCorrectPairs(prev => prev + 1);
        if (correctPairs + 1 === (gridSizeN * gridSizeM) / 2) {
          setGameState('won');
        }
      } else {
        setShowCorrect(true);
        setGameState('lost');
        setTimeout(() => {
          setShowCorrect(false);
          setGameState('idle');
        }, 3000);
      }
      setSelected([]);
    }
  };

  useEffect(() => {
    if (gameState === 'idle') {
      setColors([]);
    }
  }, [gameState]);

  const GridCell = ({ color, index }: { color: string; index: number }) => {
    const isSelected = selected.includes(index);
    const isCorrect = showCorrect && colors.indexOf(color) !== index && colors[colors.indexOf(color)] === color;
    
    return (
      <div 
        onClick={() => handleCellClick(index)} 
        className={`w-full h-full border border-slate-200 flex items-center justify-center cursor-pointer
        ${isSelected || gameState !== 'playing' ? 'bg-' + color.slice(1) : 'bg-slate-100'}
        ${isCorrect ? 'animate-pulse' : ''}`}
      >
        {isSelected && <div className="w-4 h-4 bg-white rounded-full"></div>}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Color Match Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {gameState === 'won' && <p className="text-green-500">You won! Congratulations!</p>}
          {gameState === 'lost' && <p className="text-red-500">Game Over. Try again!</p>}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label>Grid Width: {gridSizeN}</label>
              <Slider value={[gridSizeN]} onValueChange={(v) => setGridSizeN(Math.max(1, Math.min(7, v[0])))} min={1} max={7} step={1} />
            </div>
            <div>
              <label>Grid Height: {gridSizeM}</label>
              <Slider value={[gridSizeM]} onValueChange={(v) => setGridSizeM(Math.max(1, Math.min(7, v[0])))} min={1} max={7} step={1} />
            </div>
            <div>
              <label>View Time: {viewTime}s</label>
              <Slider value={[viewTime]} onValueChange={(v) => setViewTime(v as any)} min={1} max={10} step={1} />
            </div>
          </div>
          <Button onClick={startGame} disabled={gameState !== 'idle'}>Start Game</Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`grid grid-cols-${gridSizeM} grid-rows-${gridSizeN} gap-1`}>
          {colors.map((color, index) => (
            <GridCell key={index} color={color} index={index} />
          ))}
        </div>
        {gameState === 'viewing' && 
          <div className="flex items-center justify-center">
            <p>Memorize the colors!</p>
          </div>}
      </div>
    </div>
  );
};

export default App;
