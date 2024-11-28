import { useState, useEffect, useCallback } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Slider } from "../../components/ui/slider";
import "./index.css";
import React from "react";

type CellState = {
  color: string;
  revealed: boolean;
  matched: boolean;
};

const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const generateGrid = (n: number, m: number): CellState[][] => {
  const totalCells = n * m;
  const colors = Array(totalCells / 2)
    .fill(null)
    .map(() => generateRandomColor());
  const doubledColors = [...colors, ...colors];
  const shuffledColors = doubledColors.sort(() => Math.random() - 0.5);

  return Array(n)
    .fill(null)
    .map(() =>
      Array(m)
        .fill(null)
        .map(() => ({
          color: shuffledColors.pop() || "",
          revealed: true,
          matched: false,
        }))
    );
};

export default function App() {
  const [gridSize, setGridSize] = useState({ n: 2, m: 2 });
  const [visibleTime, setVisibleTime] = useState(3);
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [gameState, setGameState] = useState<
    "idle" | "showing" | "playing" | "won" | "lost"
  >("idle");
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [blinkingCell, setBlinkingCell] = useState<[number, number] | null>(
    null
  );

  const startGame = useCallback(() => {
    const newGrid = generateGrid(gridSize.n, gridSize.m);
    setGrid(newGrid);
    setGameState("showing");
    setTimeout(() => {
      setGrid((prev) =>
        prev.map((row) => row.map((cell) => ({ ...cell, revealed: false })))
      );
      setGameState("playing");
    }, visibleTime * 1000);
  }, [gridSize, visibleTime]);

  const handleCellClick = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (gameState !== "playing" || grid[rowIndex][colIndex].matched) return;

      setGrid((prev) => {
        const newGrid = [...prev];
        newGrid[rowIndex][colIndex].revealed = true;
        return newGrid;
      });

      setSelectedCells((prev) => [...prev, [rowIndex, colIndex]]);

      if (selectedCells.length === 1) {
        const [prevRow, prevCol] = selectedCells[0];
        if (grid[prevRow][prevCol].color === grid[rowIndex][colIndex].color) {
          setGrid((prev) => {
            const newGrid = [...prev];
            newGrid[prevRow][prevCol].matched = true;
            newGrid[rowIndex][colIndex].matched = true;
            return newGrid;
          });
          setSelectedCells([]);
        } else {
          setBlinkingCell([rowIndex, colIndex]);
          setTimeout(() => {
            setGameState("lost");
            setBlinkingCell(null);
          }, 3000);
        }
      }
    },
    [gameState, grid, selectedCells]
  );

  useEffect(() => {
    if (gameState === "lost" || gameState === "won") {
      setTimeout(() => {
        setGameState("idle");
        setGrid([]);
        setSelectedCells([]);
      }, 3000);
    }
  }, [gameState]);

  useEffect(() => {
    // Check if all cells are matched
    if (
      grid.length &&
      grid.every((row) => row.every((cell) => cell.matched)) //&&
    ) {
      setGameState("won");
    }
  }, [grid]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Color Matching Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Grid Size (N x M)</label>
              <div className="flex space-x-4">
                <Slider
                  min={1}
                  max={7}
                  step={1}
                  value={[gridSize.n]}
                  onValueChange={(value) =>
                    setGridSize((prev) => ({ ...prev, n: value[0] }))
                  }
                />
                <span>{gridSize.n}</span>
                <Slider
                  min={2}
                  max={8}
                  step={2}
                  value={[gridSize.m]}
                  onValueChange={(value) =>
                    setGridSize((prev) => ({ ...prev, m: value[0] }))
                  }
                />
                <span>{gridSize.m}</span>
              </div>
            </div>
            <div>
              <label className="block mb-2">Visible Time (seconds)</label>
              <div className="flex space-x-4">
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[visibleTime]}
                  onValueChange={(value) => setVisibleTime(value[0])}
                />
                <span>{visibleTime}</span>
              </div>
            </div>
            <Button
              onClick={startGame}
              disabled={gameState !== "idle"}
              className="w-full"
            >
              Start Game
            </Button>
          </div>
          <div className="mt-8">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className={`w-16 h-16 m-1 cursor-pointer transition-all duration-300 ${
                      cell.revealed || cell.matched
                        ? ""
                        : "opacity-100 bg-gray-300"
                    } ${
                      blinkingCell &&
                      blinkingCell[0] === rowIndex &&
                      blinkingCell[1] === colIndex
                        ? "animate-pulse"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        cell.revealed || cell.matched ? cell.color : undefined,
                    }}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  />
                ))}
              </div>
            ))}
          </div>
          {gameState === "won" && (
            <div className="mt-4 text-center text-2xl font-bold text-green-600">
              Congratulations! You won!
            </div>
          )}
          {gameState === "lost" && (
            <div className="mt-4 text-center text-2xl font-bold text-red-600">
              Game Over. Try again!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
