'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react';

interface StatisticsData {
  hitRatio: number;
  avgProfit: number;
  avgLoss: number;
  rrRatio: number;
  hitRatioTrend?: number; // positive or negative change
}

interface StatisticsCardsProps {
  data: StatisticsData;
  loading?: boolean;
}

export function StatisticsCards({ data, loading = false }: StatisticsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-full mb-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Hit Ratio',
      value: `${data.hitRatio.toFixed(1)}%`,
      icon: Target,
      trend: data.hitRatioTrend,
      description: 'Win rate',
      color: data.hitRatio >= 50 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Avg Profit',
      value: formatCurrency(data.avgProfit),
      icon: TrendingUp,
      description: 'Per winning trade',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Avg Loss',
      value: formatCurrency(Math.abs(data.avgLoss)),
      icon: TrendingDown,
      description: 'Per losing trade',
      color: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Risk-Reward',
      value: data.rrRatio > 0 ? `${data.rrRatio.toFixed(2)}:1` : 'N/A',
      icon: AlertCircle,
      description: 'R:R ratio',
      color: data.rrRatio >= 1.5 ? 'text-green-600 dark:text-green-400' : data.rrRatio >= 1 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                  {card.trend !== undefined && card.trend !== 0 && (
                    <span
                      className={`text-xs font-medium flex items-center ${
                        card.trend > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {card.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-0.5" />
                      )}
                      {Math.abs(card.trend).toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
