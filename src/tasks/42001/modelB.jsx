import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const EntryInput = ({ onAdd }) => {
  const [fieldName, setFieldName] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const handleAdd = () => {
    if (fieldName && fieldValue) {
      onAdd({ fieldName, fieldValue });
      setFieldName("");
      setFieldValue("");
    }
  };

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
      <Input
        placeholder="Field Name"
        value={fieldName}
        onChange={(e) => setFieldName(e.target.value)}
      />
      <Input
        placeholder="Field Value"
        value={fieldValue}
        onChange={(e) => setFieldValue(e.target.value)}
      />
      <Button onClick={handleAdd}>Add Entry</Button>
    </div>
  );
};

const ProfilePictureUpload = ({ onUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};

const PersonalBioTemplate = ({ entries, profilePicture }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <Avatar className="w-32 h-32 mx-auto mb-4">
          {profilePicture ? (
            <AvatarImage src={profilePicture} alt="Profile" />
          ) : (
            <AvatarFallback>Profile</AvatarFallback>
          )}
        </Avatar>
        <CardTitle className="text-2xl font-bold">Personal Bio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {entries.map((entry, index) => (
            <div key={index} className="space-y-1">
              <h3 className="font-semibold">{entry.fieldName}</h3>
              <p>{entry.fieldValue}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [entries, setEntries] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  const handleAddEntry = (entry) => {
    setEntries([...entries, entry]);
  };

  const handleUploadProfilePicture = (imageData) => {
    setProfilePicture(imageData);
  };

  const handleFinish = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Personal Bio Creator
        </h1>
        {isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>Add Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfilePictureUpload onUpload={handleUploadProfilePicture} />
              <EntryInput onAdd={handleAddEntry} />
              <div className="space-y-2">
                <h3 className="font-semibold">Current Entries:</h3>
                <ul className="list-disc pl-5">
                  {entries.map((entry, index) => (
                    <li key={index}>
                      {entry.fieldName}: {entry.fieldValue}
                    </li>
                  ))}
                </ul>
              </div>
              <Button onClick={handleFinish} className="w-full">
                Finish and View Bio
              </Button>
            </CardContent>
          </Card>
        ) : (
          <PersonalBioTemplate entries={entries} profilePicture={profilePicture} />
        )}
      </div>
    </div>
  );
}
