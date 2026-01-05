'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { Target, TrendingUp } from 'lucide-react';
import { Profile } from '@/types';

interface TargetProgressProps {
  currentPnL: number;
  profile: Profile;
}

export function TargetProgress({ currentPnL, profile }: TargetProgressProps) {
  const dailyProgress =
    profile.daily_target > 0 ? (currentPnL / profile.daily_target) * 100 : 0;
  const weeklyProgress =
    profile.weekly_target > 0 ? (currentPnL / profile.weekly_target) * 100 : 0;
  const monthlyProgress =
    profile.monthly_target > 0 ? (currentPnL / profile.monthly_target) * 100 : 0;

  const dailyAchieved = currentPnL >= profile.daily_target;
  const weeklyAchieved = currentPnL >= profile.weekly_target;
  const monthlyAchieved = currentPnL >= profile.monthly_target;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Target */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Daily Target</span>
              {dailyAchieved && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                  Achieved!
                </span>
              )}
            </div>
            <span className="text-sm font-bold">
              {formatCurrency(currentPnL)} / {formatCurrency(profile.daily_target)}
            </span>
          </div>
          <Progress
            value={Math.min(dailyProgress, 100)}
            className="h-3"
            indicatorClassName={dailyAchieved ? 'bg-green-500' : 'bg-primary'}
          />
          <p className="text-xs text-muted-foreground text-right">
            {dailyProgress.toFixed(1)}%
            {dailyAchieved && ' - Great job! Consider stopping for the day.'}
          </p>
        </div>

        {/* Weekly Target */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Weekly Target</span>
              {weeklyAchieved && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                  Achieved!
                </span>
              )}
            </div>
            <span className="text-sm font-bold">
              {formatCurrency(currentPnL)} / {formatCurrency(profile.weekly_target)}
            </span>
          </div>
          <Progress
            value={Math.min(weeklyProgress, 100)}
            className="h-3"
            indicatorClassName={weeklyAchieved ? 'bg-green-500' : 'bg-blue-500'}
          />
          <p className="text-xs text-muted-foreground text-right">
            {weeklyProgress.toFixed(1)}%
          </p>
        </div>

        {/* Monthly Target */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Monthly Target</span>
              {monthlyAchieved && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                  Achieved!
                </span>
              )}
            </div>
            <span className="text-sm font-bold">
              {formatCurrency(currentPnL)} / {formatCurrency(profile.monthly_target)}
            </span>
          </div>
          <Progress
            value={Math.min(monthlyProgress, 100)}
            className="h-3"
            indicatorClassName={monthlyAchieved ? 'bg-green-500' : 'bg-purple-500'}
          />
          <p className="text-xs text-muted-foreground text-right">
            {monthlyProgress.toFixed(1)}%
          </p>
        </div>

        {/* Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-medium">Keep pushing forward!</p>
              <p className="text-muted-foreground text-xs mt-1">
                Focus on executing your strategy with discipline. The results will follow.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
