'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getRiskZone } from '@/lib/utils';
import { AlertTriangle, Shield } from 'lucide-react';
import { Profile } from '@/types';

interface RiskMeterProps {
  currentLoss: number;
  maxDailyLoss: number;
  profile: Profile;
}

export function RiskMeter({ currentLoss, maxDailyLoss, profile }: RiskMeterProps) {
  const usedRisk = Math.abs(currentLoss);
  const percentage = (usedRisk / maxDailyLoss) * 100;
  const { zone, color } = getRiskZone(usedRisk, maxDailyLoss);

  const getZoneLabel = () => {
    switch (zone) {
      case 'safe':
        return 'Safe Zone';
      case 'caution':
        return 'Caution Zone';
      case 'danger':
        return 'Danger Zone';
      case 'stop':
        return 'STOP TRADING';
      default:
        return 'Safe Zone';
    }
  };

  const getZoneMessage = () => {
    switch (zone) {
      case 'safe':
        return 'You are within safe risk limits. Trade with discipline.';
      case 'caution':
        return 'Approaching 50% of daily risk limit. Be cautious with new trades.';
      case 'danger':
        return 'You have used 75% of your daily risk limit. Consider stopping for the day.';
      case 'stop':
        return 'DAILY RISK LIMIT REACHED! Stop trading immediately.';
      default:
        return 'Trade with discipline.';
    }
  };

  return (
    <Card className={zone === 'stop' ? 'border-red-500 border-2' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {zone === 'stop' ? (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          ) : (
            <Shield className="h-5 w-5 text-primary" />
          )}
          Risk Usage Meter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{getZoneLabel()}</span>
            <span className="text-sm font-bold">{percentage.toFixed(1)}%</span>
          </div>

          <div className="h-8 bg-muted rounded-full overflow-hidden relative">
            <div
              className={`h-full transition-all duration-500 ${
                zone === 'safe'
                  ? 'bg-green-500'
                  : zone === 'caution'
                  ? 'bg-yellow-500'
                  : zone === 'danger'
                  ? 'bg-red-500'
                  : 'bg-red-900'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />

            {/* Zone markers */}
            <div className="absolute inset-0 flex">
              <div className="w-[50%] border-r border-white/50" />
              <div className="w-[25%] border-r border-white/50" />
              <div className="w-[25%]" />
            </div>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Used Risk</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              {formatCurrency(usedRisk)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Remaining</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatCurrency(Math.max(0, maxDailyLoss - usedRisk))}
            </p>
          </div>
        </div>

        <div
          className={`p-3 rounded-lg ${
            zone === 'safe'
              ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900'
              : zone === 'caution'
              ? 'bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900'
              : zone === 'danger'
              ? 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900'
              : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900'
          }`}
        >
          <p
            className={`text-sm font-medium ${
              zone === 'safe'
                ? 'text-green-900 dark:text-green-100'
                : zone === 'caution'
                ? 'text-yellow-900 dark:text-yellow-100'
                : zone === 'danger'
                ? 'text-orange-900 dark:text-orange-100'
                : 'text-red-900 dark:text-red-100'
            }`}
          >
            {getZoneMessage()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
