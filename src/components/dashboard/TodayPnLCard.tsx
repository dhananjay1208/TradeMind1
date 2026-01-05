'use client';

import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Profile } from '@/types';

interface TodayPnLCardProps {
  pnl: number;
  trades: number;
  winningTrades: number;
  losingTrades: number;
  profile: Profile;
}

export function TodayPnLCard({
  pnl,
  trades,
  winningTrades,
  losingTrades,
  profile,
}: TodayPnLCardProps) {
  const isProfit = pnl >= 0;
  const roiPercent = profile.current_capital > 0
    ? (pnl / profile.current_capital) * 100
    : 0;
  const hitRatio = trades > 0 ? (winningTrades / trades) * 100 : 0;

  return (
    <Card
      className={`border-2 ${
        isProfit
          ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900'
          : pnl < 0
          ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900'
          : 'border-muted'
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-muted-foreground">
            Today's Performance
          </h3>
          {isProfit ? (
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          ) : pnl < 0 ? (
            <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
          ) : (
            <Activity className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Profit & Loss
            </p>
            <p
              className={`text-4xl font-bold ${
                isProfit
                  ? 'text-green-700 dark:text-green-300'
                  : pnl < 0
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-foreground'
              }`}
            >
              {isProfit && '+'}
              {formatCurrency(pnl)}
            </p>
            <p
              className={`text-sm font-medium mt-1 ${
                isProfit
                  ? 'text-green-600 dark:text-green-400'
                  : pnl < 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-muted-foreground'
              }`}
            >
              {formatPercent(roiPercent)} ROI
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Trades</p>
              <p className="text-xl font-bold">{trades}</p>
            </div>
            <div>
              <p className="text-xs text-green-600 dark:text-green-400 mb-1">
                Winning
              </p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">
                {winningTrades}
              </p>
            </div>
            <div>
              <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                Losing
              </p>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">
                {losingTrades}
              </p>
            </div>
          </div>

          {trades > 0 && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Hit Ratio
                </p>
                <p className="text-lg font-bold">{hitRatio.toFixed(1)}%</p>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${hitRatio}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
