import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const TodoItem = ({ todo, onEdit, onDelete, onUndelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);

  const handleEdit = () => {
    onEdit(todo.id, editedText);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex items-center justify-between p-2 mb-2 rounded ${
        todo.deleted ? "bg-gray-100" : "bg-white"
      }`}
    >
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={todo.deleted}
          onCheckedChange={() =>
            todo.deleted ? onUndelete(todo.id) : onDelete(todo.id)
          }
        />
        {isEditing ? (
          <Input
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full"
          />
        ) : (
          <span
            className={`${
              todo.deleted ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>
      <div className="space-x-2">
        {isEditing ? (
          <Button onClick={handleEdit} size="sm">
            Save
          </Button>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            variant="outline"
            disabled={todo.deleted}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([
        { id: Date.now(), text: newTodo, deleted: false },
        ...todos,
      ]);
      setNewTodo("");
    }
  };

  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, deleted: true } : todo
      )
    );
  };

  const undeleteTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, deleted: false } : todo
      )
    );
  };

  const activeTodos = todos.filter((todo) => !todo.deleted);
  const deletedTodos = todos.filter((todo) => todo.deleted);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Todo List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Add a new todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
            />
            <Button onClick={addTodo}>Add</Button>
          </div>
          <div className="space-y-2">
            {activeTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onEdit={editTodo}
                onDelete={deleteTodo}
                onUndelete={undeleteTodo}
              />
            ))}
            {deletedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onEdit={editTodo}
                onDelete={deleteTodo}
                onUndelete={undeleteTodo}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
