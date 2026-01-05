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
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-loss/10">
            <ShieldAlert className="h-5 w-5 text-loss-light" />
          </div>
          <span className="text-lg">Today's Risk Limits</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-loss/10 border border-loss/30">
            <div className="p-2 rounded-lg bg-loss/20 shrink-0">
              <TrendingDown className="h-4 w-4 text-loss-light" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Max Daily Loss
              </p>
              <p className="text-2xl font-bold text-loss-light mt-1">
                {formatCurrency(profile.max_daily_loss)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Stop trading if you hit this limit
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <div className="p-2 rounded-lg bg-orange-500/20 shrink-0">
              <DollarSign className="h-4 w-4 text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Max Loss Per Trade
              </p>
              <p className="text-2xl font-bold text-orange-400 mt-1">
                {formatCurrency(profile.max_trade_loss)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Set your stop-loss accordingly
              </p>
            </div>
          </div>

          {profile.max_trades_per_day && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <div className="p-2 rounded-lg bg-blue-500/20 shrink-0">
                <ShieldAlert className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Max Trades Today
                </p>
                <p className="text-2xl font-bold text-blue-400 mt-1">
                  {profile.max_trades_per_day}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
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
