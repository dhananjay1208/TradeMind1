'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { TrendingUp, TrendingDown, Calendar, Activity } from 'lucide-react';

interface PnLData {
  pnl: number;
  roi: number;
  trades: number;
}

interface PnLSummaryCardsProps {
  today: PnLData;
  week: PnLData;
  month: PnLData;
  allTime: PnLData;
  loading?: boolean;
}

export function PnLSummaryCards({
  today,
  week,
  month,
  allTime,
  loading = false,
}: PnLSummaryCardsProps) {
  const cards = [
    {
      title: 'Today',
      data: today,
      icon: Activity,
      period: 'daily',
    },
    {
      title: 'This Week',
      data: week,
      icon: Calendar,
      period: 'weekly',
    },
    {
      title: 'This Month',
      data: month,
      icon: Calendar,
      period: 'monthly',
    },
    {
      title: 'All Time',
      data: allTime,
      icon: TrendingUp,
      period: 'total',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-20"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const isProfit = card.data.pnl >= 0;
        const Icon = card.data.pnl >= 0 ? TrendingUp : TrendingDown;

        return (
          <Card
            key={card.title}
            className={`border-l-4 transition-all hover:shadow-lg ${
              isProfit
                ? 'border-l-green-500'
                : card.data.pnl < 0
                ? 'border-l-red-500'
                : 'border-l-muted'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon
                  className={`h-4 w-4 ${
                    isProfit
                      ? 'text-green-600 dark:text-green-400'
                      : card.data.pnl < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p
                  className={`text-2xl font-bold ${
                    isProfit
                      ? 'text-green-700 dark:text-green-300'
                      : card.data.pnl < 0
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-foreground'
                  }`}
                >
                  {isProfit && '+'}
                  {formatCurrency(card.data.pnl)}
                </p>
                <p
                  className={`text-sm font-medium ${
                    isProfit
                      ? 'text-green-600 dark:text-green-400'
                      : card.data.pnl < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-muted-foreground'
                  }`}
                >
                  {formatPercent(card.data.roi)} ROI
                </p>
                <p className="text-xs text-muted-foreground pt-1">
                  {card.data.trades} {card.data.trades === 1 ? 'trade' : 'trades'}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
