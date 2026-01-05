'use client';

import { Trade } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface TradeCardProps {
  trade: Trade;
  onClick?: () => void;
}

export function TradeCard({ trade, onClick }: TradeCardProps) {
  const pnl = trade.pnl || 0;
  const isProfitable = pnl > 0;

  const getEmotionColor = (emotion: string | null): string => {
    if (!emotion) return 'outline';

    const emotionColors: Record<string, string> = {
      // Before emotions
      'Confident': 'bg-blue-500 text-white',
      'Fearful': 'bg-orange-500 text-white',
      'FOMO': 'bg-red-500 text-white',
      'Revenge': 'bg-red-700 text-white',
      'Planned': 'bg-green-500 text-white',
      'Impulsive': 'bg-yellow-500 text-white',
      // After emotions
      'Satisfied': 'bg-green-600 text-white',
      'Regretful': 'bg-orange-600 text-white',
      'Relieved': 'bg-blue-600 text-white',
      'Frustrated': 'bg-red-600 text-white',
      'Learning': 'bg-purple-600 text-white',
    };

    return emotionColors[emotion] || 'outline';
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{trade.symbol}</h3>
                <Badge variant={trade.trade_type === 'LONG' ? 'default' : 'secondary'}>
                  {trade.trade_type}
                </Badge>
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(trade.trade_date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
                {trade.trade_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {trade.trade_time}
                  </div>
                )}
              </div>
            </div>

            {/* P&L */}
            <div className="text-right">
              <div className={`flex items-center gap-1 font-bold text-lg ${
                isProfitable ? 'text-green-600' : 'text-red-600'
              }`}>
                {isProfitable ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                {formatCurrency(pnl)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {trade.quantity} @ ₹{trade.entry_price.toFixed(2)} → ₹{trade.exit_price?.toFixed(2) || '-'}
              </div>
            </div>
          </div>

          {/* Broker Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {trade.broker}
            </Badge>
            {trade.is_winner !== null && (
              <Badge variant={trade.is_winner ? 'success' : 'destructive'} className="text-xs">
                {trade.is_winner ? 'Win' : 'Loss'}
              </Badge>
            )}
          </div>

          {/* Emotions */}
          {(trade.emotion_before || trade.emotion_after) && (
            <div className="flex flex-wrap gap-2">
              {trade.emotion_before && (
                <Badge
                  className={`text-xs ${getEmotionColor(trade.emotion_before)}`}
                >
                  Before: {trade.emotion_before}
                </Badge>
              )}
              {trade.emotion_after && (
                <Badge
                  className={`text-xs ${getEmotionColor(trade.emotion_after)}`}
                >
                  After: {trade.emotion_after}
                </Badge>
              )}
            </div>
          )}

          {/* Notes Preview */}
          {trade.notes && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {trade.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
