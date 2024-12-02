import React, { useState, useEffect } from 'react';
import { Button, Input, Select, SelectItem, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";
import { format, parseISO, addHours } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

const timeZones = [
  { value: 'America/New_York', label: 'New York' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Australia/Sydney', label: 'Sydney' },
];

function TimeZoneConverter() {
  const [sourceTime, setSourceTime] = useState(new Date());
  const [sourceZone, setSourceZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [destZone, setDestZone] = useState('Asia/Tokyo');
  const [timeFormat, setTimeFormat] = useState('12');

  useEffect(() => {
    const interval = setInterval(() => setSourceTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTime = () => {
    const utcTime = zonedTimeToUtc(sourceTime, sourceZone);
    const destTime = utcToZonedTime(utcTime, destZone);
    return format(destTime, timeFormat === '12' ? 'hh:mm:ss a' : 'HH:mm:ss');
  };

  const resetToNow = () => setSourceTime(new Date());

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-4 sm:p-6">
        <CardHeader>
          <CardTitle>Time Zone Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="datetime-local"
              value={format(sourceTime, 'yyyy-MM-ddTHH:mm')}
              onChange={(e) => setSourceTime(parseISO(e.target.value))}
            />
            <Select value={sourceZone} onChange={setSourceZone}>
              {timeZones.map(zone => <SelectItem key={zone.value} value={zone.value}>{zone.label}</SelectItem>)}
            </Select>
            <Select value={destZone} onChange={setDestZone}>
              {timeZones.map(zone => <SelectItem key={zone.value} value={zone.value}>{zone.label}</SelectItem>)}
            </Select>
            <div className="flex justify-between">
              <Button onClick={resetToNow}>Now</Button>
              <Select value={timeFormat} onChange={setTimeFormat} className="w-32">
                <SelectItem value="12">12h</SelectItem>
                <SelectItem value="24">24h</SelectItem>
              </Select>
            </div>
            <CardDescription>
              Converted Time: {convertTime()}
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return <TimeZoneConverter />;
}
