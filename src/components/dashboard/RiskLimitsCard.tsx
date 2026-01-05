'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Profile } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { ShieldAlert, TrendingDown, DollarSign } from 'lucide-react';

interface RiskLimitsCardProps {
  profile: Profile;
}

export function RiskLimitsCard({ profile }: RiskLimitsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-orange-600" />
          Today's Risk Limits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                Max Daily Loss
              </p>
              <p className="text-xl font-bold text-red-700 dark:text-red-300 mt-1">
                {formatCurrency(profile.max_daily_loss)}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Stop trading if you hit this limit
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900">
            <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Max Loss Per Trade
              </p>
              <p className="text-xl font-bold text-orange-700 dark:text-orange-300 mt-1">
                {formatCurrency(profile.max_trade_loss)}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Set your stop-loss accordingly
              </p>
            </div>
          </div>

          {profile.max_trades_per_day && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <ShieldAlert className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Max Trades Today
                </p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                  {profile.max_trades_per_day}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Quality over quantity
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
