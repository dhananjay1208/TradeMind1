'use client';

import { useState, useEffect } from 'react';
import { TradingDay, Trade, Profile } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, TrendingUp, TrendingDown, Target, Clock, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface DayDetailModalProps {
  open: boolean;
  onClose: () => void;
  tradingDay: TradingDay | null;
  profile: Profile;
}

export function DayDetailModal({ open, onClose, tradingDay, profile }: DayDetailModalProps) {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && tradingDay) {
      fetchTrades();
    }
  }, [open, tradingDay]);

  const fetchTrades = async () => {
    if (!tradingDay || !user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .eq('trade_date', tradingDay.date)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrades(data || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    });
  };

  const formatTime = (time: string | null) => {
    if (!time) return '-';
    return time;
  };

  const getMoodEmoji = (mood: string | null) => {
    if (!mood) return null;
    const moodMap: { [key: string]: string } = {
      'Confident': '😊',
      'Neutral': '😐',
      'Anxious': '😰',
      'Aggressive': '😤',
      'Calm': '🧘'
    };
    return moodMap[mood] || '😐';
  };

  if (!tradingDay) return null;

  const dayDate = new Date(tradingDay.date);
  const dateStr = format(dayDate, 'EEEE, MMMM d, yyyy');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{dateStr}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Day Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">Total P&L</div>
                <div className={`text-2xl font-bold ${
                  tradingDay.total_pnl > 0 ? 'text-green-600 dark:text-green-400' :
                  tradingDay.total_pnl < 0 ? 'text-red-600 dark:text-red-400' :
                  'text-foreground'
                }`}>
                  {formatCurrency(tradingDay.total_pnl)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  ROI: {tradingDay.roi_percent.toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">Total Trades</div>
                <div className="text-2xl font-bold">{tradingDay.total_trades}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {tradingDay.winning_trades}W / {tradingDay.losing_trades}L
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">Hit Ratio</div>
                <div className="text-2xl font-bold">{tradingDay.hit_ratio.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Win rate
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">Best / Worst</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-semibold">
                      {formatCurrency(tradingDay.max_profit)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-red-600 dark:text-red-400">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span className="text-sm font-semibold">
                      {formatCurrency(tradingDay.max_loss)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pre-market Mood and Notes */}
          {(tradingDay.pre_market_mood || tradingDay.pre_market_notes) && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {tradingDay.pre_market_mood && (
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-muted-foreground">Pre-market Mood:</div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getMoodEmoji(tradingDay.pre_market_mood)}</span>
                        <span className="font-medium">{tradingDay.pre_market_mood}</span>
                      </div>
                    </div>
                  )}
                  {tradingDay.pre_market_notes && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        Pre-market Notes:
                      </div>
                      <div className="text-sm bg-muted p-3 rounded-md">
                        {tradingDay.pre_market_notes}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trades List */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              All Trades ({trades.length})
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : trades.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground py-8">
                    No trades recorded for this day
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {trades.map((trade) => (
                  <Card key={trade.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold">{trade.symbol}</h4>
                            <Badge variant={trade.trade_type === 'LONG' ? 'default' : 'secondary'}>
                              {trade.trade_type}
                            </Badge>
                            {trade.is_winner !== null && (
                              <Badge variant={trade.is_winner ? 'success' : 'destructive'}>
                                {trade.is_winner ? 'Winner' : 'Loser'}
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Time</div>
                              <div className="font-medium">{formatTime(trade.trade_time)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Quantity</div>
                              <div className="font-medium">{trade.quantity}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Entry</div>
                              <div className="font-medium">{formatCurrency(trade.entry_price)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Exit</div>
                              <div className="font-medium">
                                {trade.exit_price ? formatCurrency(trade.exit_price) : '-'}
                              </div>
                            </div>
                          </div>

                          {trade.notes && (
                            <div className="mt-3 text-sm">
                              <div className="text-muted-foreground mb-1">Notes:</div>
                              <div className="bg-muted p-2 rounded text-sm">
                                {trade.notes}
                              </div>
                            </div>
                          )}

                          {(trade.emotion_before || trade.emotion_after) && (
                            <div className="mt-3 flex gap-4 text-sm">
                              {trade.emotion_before && (
                                <div>
                                  <span className="text-muted-foreground">Before: </span>
                                  <span className="font-medium">{trade.emotion_before}</span>
                                </div>
                              )}
                              {trade.emotion_after && (
                                <div>
                                  <span className="text-muted-foreground">After: </span>
                                  <span className="font-medium">{trade.emotion_after}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="ml-4">
                          <div className={`text-2xl font-bold ${
                            trade.pnl && trade.pnl > 0 ? 'text-green-600 dark:text-green-400' :
                            trade.pnl && trade.pnl < 0 ? 'text-red-600 dark:text-red-400' :
                            'text-foreground'
                          }`}>
                            {trade.pnl ? formatCurrency(trade.pnl) : '-'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
