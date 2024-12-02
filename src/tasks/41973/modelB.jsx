import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const elements = [
  { number: 1, name: 'Hydrogen', symbol: 'H', color: '#e6e6fa' },
  { number: 2, name: 'Helium', symbol: 'He', color: '#d9ffff' },
  // ... Add all 118 elements here. For brevity, I'll include just a few more:
  { number: 3, name: 'Lithium', symbol: 'Li', color: '#cc80ff' },
  { number: 4, name: 'Beryllium', symbol: 'Be', color: '#c2ff00' },
  { number: 5, name: 'Boron', symbol: 'B', color: '#ffb5b5' },
  // ... Continue until element 118
];

function ElementCard({ element }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card 
      className="cursor-pointer transition-transform transform hover:scale-105" 
      style={{ backgroundColor: element.color }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <CardHeader>
        <CardTitle>{element.symbol}</CardTitle>
        <CardDescription>{element.name}</CardDescription>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <p>Atomic Number: {element.number}</p>
          {/* Add more properties as needed */}
        </CardContent>
      )}
    </Card>
  );
}

export default function App() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-4">Interactive Periodic Table</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {elements.map(element => (
          <ElementCard key={element.number} element={element} />
        ))}
      </div>
      <div className="mt-4 text-center">
        <Button variant="outline">Toggle All Details</Button>
      </div>
    </div>
  );
}
