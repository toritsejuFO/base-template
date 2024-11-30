import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { format } from 'date-fns';

function App() {
  const [cards, setCards] = useState([]);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardColumn, setNewCardColumn] = useState('Todo');

  const addCard = (column) => {
    if (newCardTitle.trim()) {
      setCards([...cards, { id: Date.now(), title: newCardTitle, column, dueDate: new Date(), state: column }]);
      setNewCardTitle('');
    }
  };

  const moveCard = (id, newState) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, state: newState } : card
    ));
  };

  const columns = ['Todo', 'Doing', 'Done'];

  return (
    <div className="p-4 min-h-screen bg-gray-100 sm:flex sm:justify-center">
      <div className="sm:w-full sm:max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Tiny Kanban</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          {columns.map(column => (
            <div key={column} className="flex-1">
              <h2 className="text-xl font-semibold mb-2 text-center">{column}</h2>
              <div className="space-y-2">
                {cards.filter(card => card.state === column).map(card => (
                  <Card key={card.id}>
                    <CardHeader>
                      <CardTitle>{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Due: {format(card.dueDate, 'PP')}</p>
                      <Select value={card.state} onChange={(e) => moveCard(card.id, e.target.value)}>
                        {columns.map(col => <SelectItem key={col} value={col}>{col}</SelectItem>)}
                      </Select>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4">
                <Input 
                  placeholder="New task" 
                  value={newCardTitle} 
                  onChange={(e) => setNewCardTitle(e.target.value)} 
                  className="mb-2"
                />
                <Button onClick={() => addCard(column)}>Add Card</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
