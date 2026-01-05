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
    <Card className={zone === 'stop' ? 'loss-glow border-loss/50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            zone === 'stop' ? 'bg-loss/20' : 'bg-profit/10'
          }`}>
            {zone === 'stop' ? (
              <AlertTriangle className="h-5 w-5 text-loss-light" />
            ) : (
              <Shield className="h-5 w-5 text-profit-light" />
            )}
          </div>
          <span className="text-lg">Risk Usage Meter</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wide font-medium text-muted-foreground">{getZoneLabel()}</span>
            <span className="text-2xl font-bold">{percentage.toFixed(1)}%</span>
          </div>

          <div className="h-4 bg-white/5 rounded-full overflow-hidden relative">
            <div
              className={`h-full transition-all duration-500 ${
                zone === 'safe'
                  ? 'bg-gradient-to-r from-profit to-profit-light'
                  : zone === 'caution'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                  : zone === 'danger'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                  : 'bg-gradient-to-r from-loss-dark to-loss'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />

            {/* Zone markers */}
            <div className="absolute inset-0 flex">
              <div className="w-[50%] border-r border-white/20" />
              <div className="w-[25%] border-r border-white/20" />
              <div className="w-[25%]" />
            </div>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Used Risk</p>
            <p className="text-2xl font-bold text-loss-light">
              {formatCurrency(usedRisk)}
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Remaining</p>
            <p className="text-2xl font-bold text-profit-light">
              {formatCurrency(Math.max(0, maxDailyLoss - usedRisk))}
            </p>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            zone === 'safe'
              ? 'bg-profit/10 border-profit/30'
              : zone === 'caution'
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : zone === 'danger'
              ? 'bg-orange-500/10 border-orange-500/30'
              : 'bg-loss/10 border-loss/30'
          }`}
        >
          <p
            className={`text-sm font-medium ${
              zone === 'safe'
                ? 'text-profit-light'
                : zone === 'caution'
                ? 'text-yellow-400'
                : zone === 'danger'
                ? 'text-orange-400'
                : 'text-loss-light'
            }`}
          >
            {getZoneMessage()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
