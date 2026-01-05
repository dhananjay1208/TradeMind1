'use client';

import { TradingDay } from '@/types';
import { cn } from '@/lib/utils';
import { isSaturday, isSunday } from 'date-fns';

interface DayCardProps {
  date: Date;
  tradingDay: TradingDay | null;
  onClick: () => void;
  isCurrentMonth: boolean;
}

export function DayCard({ date, tradingDay, onClick, isCurrentMonth }: DayCardProps) {
  const day = date.getDate();
  const isWeekend = isSaturday(date) || isSunday(date);
  const isToday = new Date().toDateString() === date.toDateString();

  // Determine card background based on P&L
  const getCardStyles = () => {
    if (!tradingDay || tradingDay.total_pnl === 0) {
      // No trading or breakeven
      if (!isCurrentMonth) {
        return 'bg-muted/30 text-muted-foreground/50';
      }
      if (isWeekend) {
        return 'bg-muted/50 text-muted-foreground';
      }
      return 'bg-background hover:bg-accent/50';
    }

    const pnl = tradingDay.total_pnl;
    const absPnl = Math.abs(pnl);

    // Breakeven zone (±100)
    if (absPnl <= 100) {
      return 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700';
    }

    // Calculate intensity based on amount
    // Using a logarithmic scale for better visual distribution
    const intensity = Math.min(Math.log10(absPnl + 1) / 4, 1); // Cap at 100%

    if (pnl > 0) {
      // Profit - Green gradient
      const opacity = Math.max(0.2, intensity);
      return cn(
        'hover:opacity-90 transition-opacity',
        opacity > 0.7
          ? 'bg-green-600 text-white'
          : opacity > 0.4
          ? 'bg-green-400 text-green-950'
          : 'bg-green-200 text-green-900'
      );
    } else {
      // Loss - Red gradient
      const opacity = Math.max(0.2, intensity);
      return cn(
        'hover:opacity-90 transition-opacity',
        opacity > 0.7
          ? 'bg-red-600 text-white'
          : opacity > 0.4
          ? 'bg-red-400 text-red-950'
          : 'bg-red-200 text-red-900'
      );
    }
  };

  const formatPnL = (pnl: number) => {
    const sign = pnl >= 0 ? '+' : '';
    if (Math.abs(pnl) >= 1000) {
      return `${sign}${(pnl / 1000).toFixed(1)}k`;
    }
    return `${sign}${pnl.toFixed(0)}`;
  };

  return (
    <button
      onClick={onClick}
      disabled={!tradingDay}
      className={cn(
        'relative min-h-20 md:min-h-24 p-2 rounded-lg border transition-all',
        'flex flex-col items-start justify-start',
        'disabled:cursor-default',
        isToday && 'ring-2 ring-primary ring-offset-2',
        getCardStyles()
      )}
    >
      <div className="flex items-center justify-between w-full mb-1">
        <span className={cn(
          'text-sm font-medium',
          !isCurrentMonth && 'text-muted-foreground/50'
        )}>
          {day}
        </span>
        {isWeekend && isCurrentMonth && (
          <span className="text-xs text-muted-foreground">Weekend</span>
        )}
      </div>

      {tradingDay && (
        <div className="flex flex-col gap-0.5 w-full mt-auto">
          <div className={cn(
            'text-base md:text-lg font-bold',
            tradingDay.total_pnl > 0 ? 'text-green-900 dark:text-green-100' :
            tradingDay.total_pnl < 0 ? 'text-red-900 dark:text-red-100' :
            'text-gray-600 dark:text-gray-400'
          )}>
            {formatPnL(tradingDay.total_pnl)}
          </div>
          {tradingDay.total_trades > 0 && (
            <div className="text-xs opacity-75">
              {tradingDay.total_trades} trade{tradingDay.total_trades !== 1 ? 's' : ''}
            </div>
          )}
          {tradingDay.hit_ratio > 0 && (
            <div className="text-xs opacity-75">
              {tradingDay.hit_ratio.toFixed(0)}% win
            </div>
          )}
        </div>
      )}
    </button>
  );
}
