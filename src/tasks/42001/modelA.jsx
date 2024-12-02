import React, { useState } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";

function BioEntry({ onRemove }) {
  const [field, setField] = useState('');
  const [value, setValue] = useState('');

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>New Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          placeholder="Field Name (e.g., Job Title)" 
          value={field} 
          onChange={(e) => setField(e.target.value)} 
          className="mb-2"
        />
        <Input 
          placeholder="Value (e.g., Software Developer)" 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
        />
      </CardContent>
      <Button variant="destructive" onClick={onRemove}>Remove</Button>
    </Card>
  );
}

function ProfileDisplay({ entries, image }) {
  return (
    <div className="flex flex-col items-center p-4">
      <img src={image} alt="Profile" className="w-32 h-32 rounded-full mb-4 object-cover"/>
      <Card>
        <CardContent>
          {entries.map((entry, index) => (
            <div key={index} className="mb-2">
              <strong>{entry.field}:</strong> {entry.value}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  const handleAddEntry = () => {
    setEntries([...entries, { field: '', value: '' }]);
  };

  const handleRemoveEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {isEditing ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Create Your Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <Input 
                  type="file" 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="mb-4"
                />
                {entries.map((_, index) => (
                  <BioEntry 
                    key={index} 
                    onRemove={() => handleRemoveEntry(index)} 
                  />
                ))}
                <Button onClick={handleAddEntry} className="mt-2">Add Entry</Button>
              </CardContent>
            </Card>
            <Button 
              onClick={() => setIsEditing(false)} 
              className="mt-4 w-full"
            >
              Preview Bio
            </Button>
          </>
        ) : (
          <>
            <ProfileDisplay entries={entries} image={image} />
            <Button 
              onClick={() => setIsEditing(true)} 
              className="mt-4 w-full"
            >
              Edit Bio
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
