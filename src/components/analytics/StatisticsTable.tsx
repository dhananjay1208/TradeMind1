'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface PeriodStats {
  totalPnL: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  hitRatio: number;
  avgProfit: number;
  avgLoss: number;
  maxProfit: number;
  maxLoss: number;
  rrRatio: number;
  roi: number;
  profitFactor: number;
}

interface StatisticsTableProps {
  today: PeriodStats;
  week: PeriodStats;
  month: PeriodStats;
  allTime: PeriodStats;
  loading?: boolean;
}

export function StatisticsTable({
  today,
  week,
  month,
  allTime,
  loading = false,
}: StatisticsTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detailed Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Loading statistics...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      label: 'Total P&L',
      today: formatCurrency(today.totalPnL),
      week: formatCurrency(week.totalPnL),
      month: formatCurrency(month.totalPnL),
      allTime: formatCurrency(allTime.totalPnL),
      colorFn: (val: number) =>
        val > 0
          ? 'text-green-600 dark:text-green-400 font-bold'
          : val < 0
          ? 'text-red-600 dark:text-red-400 font-bold'
          : 'text-foreground',
      getValue: (stats: PeriodStats) => stats.totalPnL,
    },
    {
      label: 'Total Trades',
      today: today.totalTrades,
      week: week.totalTrades,
      month: month.totalTrades,
      allTime: allTime.totalTrades,
    },
    {
      label: 'Winning Trades',
      today: today.winningTrades,
      week: week.winningTrades,
      month: month.winningTrades,
      allTime: allTime.winningTrades,
      colorFn: () => 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Losing Trades',
      today: today.losingTrades,
      week: week.losingTrades,
      month: month.losingTrades,
      allTime: allTime.losingTrades,
      colorFn: () => 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Hit Ratio',
      today: `${today.hitRatio.toFixed(1)}%`,
      week: `${week.hitRatio.toFixed(1)}%`,
      month: `${month.hitRatio.toFixed(1)}%`,
      allTime: `${allTime.hitRatio.toFixed(1)}%`,
      colorFn: (val: number) =>
        val >= 50 ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-foreground',
      getValue: (stats: PeriodStats) => stats.hitRatio,
    },
    {
      label: 'Avg Profit',
      today: formatCurrency(today.avgProfit),
      week: formatCurrency(week.avgProfit),
      month: formatCurrency(month.avgProfit),
      allTime: formatCurrency(allTime.avgProfit),
      colorFn: () => 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Avg Loss',
      today: formatCurrency(Math.abs(today.avgLoss)),
      week: formatCurrency(Math.abs(week.avgLoss)),
      month: formatCurrency(Math.abs(month.avgLoss)),
      allTime: formatCurrency(Math.abs(allTime.avgLoss)),
      colorFn: () => 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Max Profit',
      today: formatCurrency(today.maxProfit),
      week: formatCurrency(week.maxProfit),
      month: formatCurrency(month.maxProfit),
      allTime: formatCurrency(allTime.maxProfit),
      colorFn: () => 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Max Loss',
      today: formatCurrency(Math.abs(today.maxLoss)),
      week: formatCurrency(Math.abs(week.maxLoss)),
      month: formatCurrency(Math.abs(month.maxLoss)),
      allTime: formatCurrency(Math.abs(allTime.maxLoss)),
      colorFn: () => 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Risk-Reward Ratio',
      today: today.rrRatio > 0 ? `${today.rrRatio.toFixed(2)}:1` : 'N/A',
      week: week.rrRatio > 0 ? `${week.rrRatio.toFixed(2)}:1` : 'N/A',
      month: month.rrRatio > 0 ? `${month.rrRatio.toFixed(2)}:1` : 'N/A',
      allTime: allTime.rrRatio > 0 ? `${allTime.rrRatio.toFixed(2)}:1` : 'N/A',
      colorFn: (val: number) =>
        val >= 1.5
          ? 'text-green-600 dark:text-green-400 font-semibold'
          : val >= 1
          ? 'text-orange-600 dark:text-orange-400'
          : 'text-red-600 dark:text-red-400',
      getValue: (stats: PeriodStats) => stats.rrRatio,
    },
    {
      label: 'ROI %',
      today: formatPercent(today.roi),
      week: formatPercent(week.roi),
      month: formatPercent(month.roi),
      allTime: formatPercent(allTime.roi),
      colorFn: (val: number) =>
        val > 0
          ? 'text-green-600 dark:text-green-400 font-semibold'
          : val < 0
          ? 'text-red-600 dark:text-red-400 font-semibold'
          : 'text-foreground',
      getValue: (stats: PeriodStats) => stats.roi,
    },
    {
      label: 'Profit Factor',
      today: today.profitFactor > 0 ? today.profitFactor.toFixed(2) : 'N/A',
      week: week.profitFactor > 0 ? week.profitFactor.toFixed(2) : 'N/A',
      month: month.profitFactor > 0 ? month.profitFactor.toFixed(2) : 'N/A',
      allTime: allTime.profitFactor > 0 ? allTime.profitFactor.toFixed(2) : 'N/A',
      colorFn: (val: number) =>
        val >= 2
          ? 'text-green-600 dark:text-green-400 font-semibold'
          : val >= 1
          ? 'text-orange-600 dark:text-orange-400'
          : 'text-red-600 dark:text-red-400',
      getValue: (stats: PeriodStats) => stats.profitFactor,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Metric
                </th>
                <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Today
                </th>
                <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">
                  This Week
                </th>
                <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">
                  This Month
                </th>
                <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">
                  All Time
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr
                  key={metric.label}
                  className={`border-b hover:bg-muted/50 transition-colors ${
                    index % 2 === 0 ? 'bg-muted/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-sm">
                    {metric.label}
                  </td>
                  <td
                    className={`py-3 px-4 text-right text-sm ${
                      metric.colorFn
                        ? metric.colorFn(
                            metric.getValue ? metric.getValue(today) : 0
                          )
                        : ''
                    }`}
                  >
                    {metric.today}
                  </td>
                  <td
                    className={`py-3 px-4 text-right text-sm ${
                      metric.colorFn
                        ? metric.colorFn(
                            metric.getValue ? metric.getValue(week) : 0
                          )
                        : ''
                    }`}
                  >
                    {metric.week}
                  </td>
                  <td
                    className={`py-3 px-4 text-right text-sm ${
                      metric.colorFn
                        ? metric.colorFn(
                            metric.getValue ? metric.getValue(month) : 0
                          )
                        : ''
                    }`}
                  >
                    {metric.month}
                  </td>
                  <td
                    className={`py-3 px-4 text-right text-sm ${
                      metric.colorFn
                        ? metric.colorFn(
                            metric.getValue ? metric.getValue(allTime) : 0
                          )
                        : ''
                    }`}
                  >
                    {metric.allTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
