import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLUMNS = ["Todo", "Doing", "Done"];

const KanbanCard = ({ card, onStateChange, onDelete }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{card.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">Due: {card.dueDate}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Select value={card.state} onValueChange={onStateChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            {COLUMNS.map((column) => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

const KanbanColumn = ({ title, cards, onAddCard, onStateChange, onDeleteCard }) => {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDueDate, setNewCardDueDate] = useState("");

  const handleAddCard = () => {
    if (newCardTitle && newCardDueDate) {
      onAddCard(title, newCardTitle, newCardDueDate);
      setNewCardTitle("");
      setNewCardDueDate("");
    }
  };

  return (
    <div className="flex-1 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {cards.map((card) => (
        <KanbanCard
          key={card.id}
          card={card}
          onStateChange={(newState) => onStateChange(card.id, newState)}
          onDelete={() => onDeleteCard(card.id)}
        />
      ))}
      <div className="mt-4">
        <Input
          type="text"
          placeholder="Card title"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          className="mb-2"
        />
        <Input
          type="date"
          value={newCardDueDate}
          onChange={(e) => setNewCardDueDate(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handleAddCard}>Add Card</Button>
      </div>
    </div>
  );
};

export default function App() {
  const [cards, setCards] = useState([]);

  const addCard = (column, title, dueDate) => {
    const newCard = {
      id: Date.now(),
      title,
      dueDate,
      state: column,
    };
    setCards([...cards, newCard]);
  };

  const changeCardState = (cardId, newState) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, state: newState } : card
      )
    );
  };

  const deleteCard = (cardId) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Tiny Kanban</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column}
            title={column}
            cards={cards.filter((card) => card.state === column)}
            onAddCard={addCard}
            onStateChange={changeCardState}
            onDeleteCard={deleteCard}
          />
        ))}
      </div>
    </div>
  );
}
