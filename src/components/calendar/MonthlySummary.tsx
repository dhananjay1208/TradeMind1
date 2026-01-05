'use client';

import { TradingDay, Profile } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, Calendar as CalendarIcon } from 'lucide-react';

interface MonthlySummaryProps {
  tradingDays: TradingDay[];
  profile: Profile;
  monthName: string;
  year: number;
}

export function MonthlySummary({ tradingDays, profile, monthName, year }: MonthlySummaryProps) {
  // Calculate monthly statistics
  const totalPnL = tradingDays.reduce((sum, day) => sum + day.total_pnl, 0);
  const tradingDaysCount = tradingDays.filter(day => day.total_trades > 0).length;
  const greenDays = tradingDays.filter(day => day.total_pnl > 0).length;
  const redDays = tradingDays.filter(day => day.total_pnl < 0).length;

  const totalTrades = tradingDays.reduce((sum, day) => sum + day.total_trades, 0);
  const totalWinningTrades = tradingDays.reduce((sum, day) => sum + day.winning_trades, 0);

  const hitRatio = totalTrades > 0 ? (totalWinningTrades / totalTrades) * 100 : 0;

  const bestDay = tradingDays.reduce((best, day) =>
    day.total_pnl > best.total_pnl ? day : best,
    { total_pnl: 0 } as TradingDay
  );

  const worstDay = tradingDays.reduce((worst, day) =>
    day.total_pnl < worst.total_pnl ? day : worst,
    { total_pnl: 0 } as TradingDay
  );

  // Calculate ROI based on average capital
  const avgCapital = profile.current_capital;
  const roi = avgCapital > 0 ? (totalPnL / avgCapital) * 100 : 0;

  // Calculate target achievement
  const monthlyTargetAchievement = profile.monthly_target > 0
    ? (totalPnL / profile.monthly_target) * 100
    : 0;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    });
  };

  const StatCard = ({
    label,
    value,
    subtext,
    trend
  }: {
    label: string;
    value: string;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral'
  }) => (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className={`text-lg font-bold ${
          trend === 'up' ? 'text-green-600 dark:text-green-400' :
          trend === 'down' ? 'text-red-600 dark:text-red-400' :
          'text-foreground'
        }`}>
          {value}
        </div>
        {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />}
        {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />}
      </div>
      {subtext && (
        <div className="text-xs text-muted-foreground">{subtext}</div>
      )}
    </div>
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-6">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">
            {monthName} {year} Summary
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <StatCard
            label="Total P&L"
            value={formatCurrency(totalPnL)}
            trend={totalPnL > 0 ? 'up' : totalPnL < 0 ? 'down' : 'neutral'}
          />

          <StatCard
            label="Trading Days"
            value={tradingDaysCount.toString()}
            subtext={`${greenDays} green, ${redDays} red`}
          />

          <StatCard
            label="Hit Ratio"
            value={`${hitRatio.toFixed(1)}%`}
            subtext={`${totalWinningTrades}/${totalTrades} trades`}
          />

          <StatCard
            label="Green Days"
            value={greenDays.toString()}
            subtext={`${((greenDays / Math.max(tradingDaysCount, 1)) * 100).toFixed(0)}% of days`}
            trend="up"
          />

          <StatCard
            label="Best Day"
            value={formatCurrency(bestDay.total_pnl || 0)}
            subtext={bestDay.date ? new Date(bestDay.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-'}
          />

          <StatCard
            label="Worst Day"
            value={formatCurrency(worstDay.total_pnl || 0)}
            subtext={worstDay.date ? new Date(worstDay.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-'}
          />

          <StatCard
            label="ROI"
            value={`${roi.toFixed(2)}%`}
            trend={roi > 0 ? 'up' : roi < 0 ? 'down' : 'neutral'}
          />

          <StatCard
            label="Monthly Target"
            value={`${monthlyTargetAchievement.toFixed(0)}%`}
            subtext={
              monthlyTargetAchievement >= 100
                ? 'Target Achieved!'
                : `${formatCurrency(profile.monthly_target - totalPnL)} to go`
            }
            trend={monthlyTargetAchievement >= 100 ? 'up' : 'neutral'}
          />
        </div>

        {monthlyTargetAchievement >= 100 && (
          <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-center gap-3">
            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <div className="font-semibold text-green-900 dark:text-green-100">
                Monthly Target Achieved!
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Congratulations on reaching your monthly goal of {formatCurrency(profile.monthly_target)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
