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
      className={`relative overflow-hidden ${
        isProfit
          ? 'profit-glow border-profit/30'
          : pnl < 0
          ? 'loss-glow border-loss/30'
          : ''
      }`}
    >
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Today's Performance
          </h3>
          <div className={`p-2 rounded-xl ${
            isProfit ? 'bg-profit/10' : pnl < 0 ? 'bg-loss/10' : 'bg-muted/10'
          }`}>
            {isProfit ? (
              <TrendingUp className="h-5 w-5 text-profit-light" />
            ) : pnl < 0 ? (
              <TrendingDown className="h-5 w-5 text-loss-light" />
            ) : (
              <Activity className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Profit & Loss
            </p>
            <p
              className={`text-5xl font-bold tracking-tight ${
                isProfit
                  ? 'text-profit-light'
                  : pnl < 0
                  ? 'text-loss-light'
                  : 'text-foreground'
              }`}
            >
              {isProfit && '+'}
              {formatCurrency(pnl)}
            </p>
            <p
              className={`text-sm font-semibold mt-2 ${
                isProfit
                  ? 'text-profit'
                  : pnl < 0
                  ? 'text-loss'
                  : 'text-muted-foreground'
              }`}
            >
              {formatPercent(roiPercent)} ROI
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Trades</p>
              <p className="text-2xl font-bold">{trades}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-profit mb-2 uppercase tracking-wide">
                Won
              </p>
              <p className="text-2xl font-bold text-profit-light">
                {winningTrades}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-loss mb-2 uppercase tracking-wide">
                Lost
              </p>
              <p className="text-2xl font-bold text-loss-light">
                {losingTrades}
              </p>
            </div>
          </div>

          {trades > 0 && (
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Hit Ratio
                </p>
                <p className="text-xl font-bold text-profit-light">{hitRatio.toFixed(1)}%</p>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-profit to-profit-light transition-all duration-500 rounded-full"
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
