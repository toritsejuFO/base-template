import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const elements = [
  { symbol: "H", name: "Hydrogen", atomicNumber: 1, color: "bg-blue-200" },
  { symbol: "He", name: "Helium", atomicNumber: 2, color: "bg-yellow-200" },
  { symbol: "Li", name: "Lithium", atomicNumber: 3, color: "bg-red-200" },
  { symbol: "Be", name: "Beryllium", atomicNumber: 4, color: "bg-green-200" },
  { symbol: "B", name: "Boron", atomicNumber: 5, color: "bg-orange-200" },
  { symbol: "C", name: "Carbon", atomicNumber: 6, color: "bg-gray-200" },
  { symbol: "N", name: "Nitrogen", atomicNumber: 7, color: "bg-blue-300" },
  { symbol: "O", name: "Oxygen", atomicNumber: 8, color: "bg-red-300" },
  { symbol: "F", name: "Fluorine", atomicNumber: 9, color: "bg-green-300" },
  { symbol: "Ne", name: "Neon", atomicNumber: 10, color: "bg-purple-200" },
  // ... Add all 118 elements here
];

const Element = ({ symbol, name, atomicNumber, color, onClick }) => (
  <Card
    className={`w-12 h-12 sm:w-16 sm:h-16 ${color} cursor-pointer transition-transform hover:scale-105`}
    onClick={onClick}
  >
    <CardContent className="p-1 text-center">
      <div className="text-xs sm:text-sm font-bold">{symbol}</div>
      <div className="text-xs">{atomicNumber}</div>
    </CardContent>
  </Card>
);

const ElementDetails = ({ element, onClose }) => (
  <Dialog open={!!element} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{element?.name}</DialogTitle>
      </DialogHeader>
      <div className="mt-4">
        <p>Symbol: {element?.symbol}</p>
        <p>Atomic Number: {element?.atomicNumber}</p>
        {/* Add more properties here */}
      </div>
    </DialogContent>
  </Dialog>
);

const PeriodicTable = () => {
  const [selectedElement, setSelectedElement] = useState(null);

  return (
    <div className="grid grid-cols-18 gap-1 p-4">
      {elements.map((element) => (
        <Element
          key={element.symbol}
          {...element}
          onClick={() => setSelectedElement(element)}
        />
      ))}
      <ElementDetails
        element={selectedElement}
        onClose={() => setSelectedElement(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Periodic Table</h1>
      <PeriodicTable />
    </div>
  );
}
