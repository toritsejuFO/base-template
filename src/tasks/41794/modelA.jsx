import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

function TodoItem({ todo, onEdit, onDelete, onUndelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(todo.id, editedText);
    }
    setIsEditing(!isEditing);
  };

  return (
    <Card className="mb-2 last:mb-0">
      <CardHeader>
        <CardTitle>
          {isEditing ? (
            <Input 
              value={editedText} 
              onChange={(e) => setEditedText(e.target.value)} 
              autoFocus 
            />
          ) : (
            <span className={todo.deleted ? "line-through text-muted-foreground" : ""}>
              {todo.text}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Checkbox 
          checked={!todo.deleted} 
          onCheckedChange={() => todo.deleted ? onUndelete(todo.id) : onDelete(todo.id)} 
        />
        <div>
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            {isEditing ? 'Save' : 'Edit'}
          </Button>
          {todo.deleted && (
            <Button variant="ghost" size="icon" onClick={() => onUndelete(todo.id)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, deleted: false }]);
      setNewTodo('');
    }
  };

  const editTodo = (id, text) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: text } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, deleted: true } : todo
    ).sort((a, b) => (a.deleted === b.deleted) ? 0 : a.deleted ? 1 : -1));
  };

  const undeleteTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, deleted: false } : todo
    ));
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Todo List</CardTitle>
            <CardDescription>Add and manage your todos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input 
                placeholder="Add new todo..." 
                value={newTodo} 
                onChange={(e) => setNewTodo(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
              <Button onClick={addTodo}>Add</Button>
            </div>
            {todos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onEdit={editTodo} 
                onDelete={deleteTodo} 
                onUndelete={undeleteTodo} 
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
