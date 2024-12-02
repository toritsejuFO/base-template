import React, { useState, useEffect } from "react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const timezones = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
  "Australia/Sydney",
  // Add more timezones as needed
];

export default function App() {
  const [sourceTimezone, setSourceTimezone] = useState("");
  const [destTimezone, setDestTimezone] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    setSourceTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const handleSourceTimezoneChange = (value) => {
    setSourceTimezone(value);
  };

  const handleDestTimezoneChange = (value) => {
    setDestTimezone(value);
  };

  const handleDateTimeChange = (e) => {
    setDateTime(new Date(e.target.value));
  };

  const resetToCurrentTime = () => {
    setDateTime(new Date());
  };

  const toggleTimeFormat = () => {
    setIs24Hour(!is24Hour);
  };

  const formatTime = (date, timezone) => {
    return date.toLocaleString("en-US", {
      timeZone: timezone,
      hour12: !is24Hour,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Timezone Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Source Timezone</label>
            <Select
              value={sourceTimezone}
              onValueChange={handleSourceTimezoneChange}
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Destination Timezone</label>
            <Select
              value={destTimezone}
              onValueChange={handleDestTimezoneChange}
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date and Time</label>
            <Input
              type="datetime-local"
              value={dateTime.toISOString().slice(0, 16)}
              onChange={handleDateTimeChange}
            />
          </div>
          <Button onClick={resetToCurrentTime} className="w-full">
            Reset to Current Time
          </Button>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">24-hour format</span>
            <Switch checked={is24Hour} onCheckedChange={toggleTimeFormat} />
          </div>
          {sourceTimezone && destTimezone && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">
                {sourceTimezone}: {formatTime(dateTime, sourceTimezone)}
              </p>
              <p className="text-sm font-medium">
                {destTimezone}: {formatTime(dateTime, destTimezone)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
