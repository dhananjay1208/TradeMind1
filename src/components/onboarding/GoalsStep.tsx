'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target } from 'lucide-react';

interface GoalsStepProps {
  dailyTarget: string;
  weeklyTarget: string;
  monthlyTarget: string;
  onDailyTargetChange: (value: string) => void;
  onWeeklyTargetChange: (value: string) => void;
  onMonthlyTargetChange: (value: string) => void;
}

export function GoalsStep({
  dailyTarget,
  weeklyTarget,
  monthlyTarget,
  onDailyTargetChange,
  onWeeklyTargetChange,
  onMonthlyTargetChange,
}: GoalsStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Set Your Profit Targets
        </CardTitle>
        <CardDescription>
          Define realistic profit goals to stay motivated and track progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="dailyTarget">Daily Profit Target (INR)</Label>
          <Input
            id="dailyTarget"
            type="number"
            placeholder="e.g., 1000"
            value={dailyTarget}
            onChange={(e) => onDailyTargetChange(e.target.value)}
            min="0"
            step="100"
          />
          <p className="text-sm text-muted-foreground">
            Your target profit for each trading day
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="weeklyTarget">Weekly Profit Target (INR)</Label>
          <Input
            id="weeklyTarget"
            type="number"
            placeholder="e.g., 5000"
            value={weeklyTarget}
            onChange={(e) => onWeeklyTargetChange(e.target.value)}
            min="0"
            step="500"
          />
          <p className="text-sm text-muted-foreground">
            Your cumulative profit target for the week
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthlyTarget">Monthly Profit Target (INR)</Label>
          <Input
            id="monthlyTarget"
            type="number"
            placeholder="e.g., 20000"
            value={monthlyTarget}
            onChange={(e) => onMonthlyTargetChange(e.target.value)}
            min="0"
            step="1000"
          />
          <p className="text-sm text-muted-foreground">
            Your cumulative profit target for the month
          </p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Set realistic targets based on your capital and risk management.
            It's better to achieve smaller consistent goals than to chase unrealistic profits.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
