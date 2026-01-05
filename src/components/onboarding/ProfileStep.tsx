'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileStepProps {
  fullName: string;
  startingCapital: string;
  onFullNameChange: (value: string) => void;
  onStartingCapitalChange: (value: string) => void;
}

export function ProfileStep({
  fullName,
  startingCapital,
  onFullNameChange,
  onStartingCapitalChange,
}: ProfileStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to TradeMind</CardTitle>
        <CardDescription>
          Let's start by setting up your trading profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startingCapital">Starting Capital (INR)</Label>
          <Input
            id="startingCapital"
            type="number"
            placeholder="e.g., 100000"
            value={startingCapital}
            onChange={(e) => onStartingCapitalChange(e.target.value)}
            min="0"
            step="1000"
          />
          <p className="text-sm text-muted-foreground">
            This is the capital you'll start trading with
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
