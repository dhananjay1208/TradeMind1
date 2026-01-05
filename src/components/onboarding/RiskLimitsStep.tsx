'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RiskLimitsStepProps {
  maxDailyLoss: string;
  maxTradeLoss: string;
  maxTradesPerDay: string;
  onMaxDailyLossChange: (value: string) => void;
  onMaxTradeLossChange: (value: string) => void;
  onMaxTradesPerDayChange: (value: string) => void;
}

export function RiskLimitsStep({
  maxDailyLoss,
  maxTradeLoss,
  maxTradesPerDay,
  onMaxDailyLossChange,
  onMaxTradeLossChange,
  onMaxTradesPerDayChange,
}: RiskLimitsStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Define Your Risk Limits</CardTitle>
        <CardDescription>
          Set strict risk management parameters to protect your capital
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="maxDailyLoss">Max Daily Loss (INR)</Label>
          <Input
            id="maxDailyLoss"
            type="number"
            placeholder="e.g., 2000"
            value={maxDailyLoss}
            onChange={(e) => onMaxDailyLossChange(e.target.value)}
            min="0"
            step="100"
          />
          <p className="text-sm text-muted-foreground">
            Maximum amount you're willing to lose in a single day
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxTradeLoss">Max Loss Per Trade (INR)</Label>
          <Input
            id="maxTradeLoss"
            type="number"
            placeholder="e.g., 500"
            value={maxTradeLoss}
            onChange={(e) => onMaxTradeLossChange(e.target.value)}
            min="0"
            step="50"
          />
          <p className="text-sm text-muted-foreground">
            Maximum amount you're willing to lose on a single trade
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxTradesPerDay">Max Trades Per Day</Label>
          <Input
            id="maxTradesPerDay"
            type="number"
            placeholder="e.g., 5"
            value={maxTradesPerDay}
            onChange={(e) => onMaxTradesPerDayChange(e.target.value)}
            min="1"
            step="1"
          />
          <p className="text-sm text-muted-foreground">
            Limit the number of trades to avoid overtrading
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
