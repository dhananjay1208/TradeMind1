'use client';

import { useState } from 'react';
import { Trade } from '@/types';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TradeEntryForm } from './TradeEntryForm';
import {
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  Activity,
  Brain,
  FileText,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TradeDetailModalProps {
  trade: Trade | null;
  open: boolean;
  onClose: () => void;
  onTradeUpdated?: () => void;
}

export function TradeDetailModal({ trade, open, onClose, onTradeUpdated }: TradeDetailModalProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!trade) return null;

  const pnl = trade.pnl || 0;
  const isProfitable = pnl > 0;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trade? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);

      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', trade.id);

      if (error) throw error;

      // Update trading_day stats if linked
      if (trade.trading_day_id) {
        await supabase.rpc('update_trading_day_stats', {
          day_id: trade.trading_day_id
        });
      }

      toast({
        title: 'Trade Deleted',
        description: 'The trade has been deleted successfully',
      });

      if (onTradeUpdated) {
        onTradeUpdated();
      }
      onClose();
    } catch (error) {
      console.error('Error deleting trade:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete trade. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTradeUpdated = () => {
    setIsEditing(false);
    if (onTradeUpdated) {
      onTradeUpdated();
    }
  };

  const getEmotionBadgeStyle = (emotion: string | null): string => {
    if (!emotion) return '';

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

    return emotionColors[emotion] || '';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {isEditing ? (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Trade</DialogTitle>
              <DialogDescription>Update trade details</DialogDescription>
            </DialogHeader>
            <TradeEntryForm
              editingTrade={trade}
              onTradeAdded={handleTradeUpdated}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{trade.symbol}</span>
                  <Badge variant={trade.trade_type === 'LONG' ? 'default' : 'secondary'}>
                    {trade.trade_type}
                  </Badge>
                  {trade.is_winner !== null && (
                    <Badge variant={trade.is_winner ? 'success' : 'destructive'}>
                      {trade.is_winner ? 'Winner' : 'Loser'}
                    </Badge>
                  )}
                </div>
              </DialogTitle>
              <DialogDescription>Trade details and analysis</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="emotions">Emotions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                {/* P&L Card */}
                <div className={`p-6 rounded-lg ${
                  isProfitable ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isProfitable ? (
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      ) : (
                        <TrendingDown className="h-8 w-8 text-red-600" />
                      )}
                      <div>
                        <div className="text-sm text-muted-foreground">Profit & Loss</div>
                        <div className={`text-3xl font-bold ${
                          isProfitable ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(pnl)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {trade.broker}
                    </Badge>
                  </div>
                </div>

                {/* Trade Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Date
                    </div>
                    <div className="font-medium">
                      {new Date(trade.trade_date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  {trade.trade_time && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Time
                      </div>
                      <div className="font-medium">{trade.trade_time}</div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      Quantity
                    </div>
                    <div className="font-medium">{trade.quantity} shares</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Entry Price
                    </div>
                    <div className="font-medium">₹{trade.entry_price.toFixed(2)}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Exit Price
                    </div>
                    <div className="font-medium">
                      {trade.exit_price ? `₹${trade.exit_price.toFixed(2)}` : 'N/A'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      Price Change
                    </div>
                    <div className={`font-medium ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                      {trade.exit_price
                        ? `${((trade.exit_price - trade.entry_price) / trade.entry_price * 100).toFixed(2)}%`
                        : 'N/A'
                      }
                    </div>
                  </div>
                </div>

                {/* Screenshot */}
                {trade.screenshot_url && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ImageIcon className="h-4 w-4" />
                      Screenshot
                    </div>
                    <img
                      src={trade.screenshot_url}
                      alt="Trade screenshot"
                      className="rounded-lg border w-full"
                    />
                  </div>
                )}
              </TabsContent>

              {/* Emotions Tab */}
              <TabsContent value="emotions" className="space-y-4">
                <div className="space-y-4">
                  {trade.emotion_before && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Brain className="h-4 w-4" />
                        Emotion Before Trade
                      </div>
                      <Badge className={`${getEmotionBadgeStyle(trade.emotion_before)} text-base px-4 py-2`}>
                        {trade.emotion_before}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {getEmotionDescription(trade.emotion_before, 'before')}
                      </p>
                    </div>
                  )}

                  {trade.emotion_after && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Brain className="h-4 w-4" />
                        Emotion After Trade
                      </div>
                      <Badge className={`${getEmotionBadgeStyle(trade.emotion_after)} text-base px-4 py-2`}>
                        {trade.emotion_after}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {getEmotionDescription(trade.emotion_after, 'after')}
                      </p>
                    </div>
                  )}

                  {!trade.emotion_before && !trade.emotion_after && (
                    <p className="text-center text-muted-foreground py-8">
                      No emotion data recorded for this trade
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-4">
                {trade.notes ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Trading Notes & Learning
                    </div>
                    <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                      {trade.notes}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No notes recorded for this trade
                  </p>
                )}
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Trade
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="flex items-center">Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getEmotionDescription(emotion: string, timing: 'before' | 'after'): string {
  const descriptions: Record<string, Record<string, string>> = {
    before: {
      'Confident': 'You entered this trade with confidence and conviction in your analysis.',
      'Fearful': 'You were feeling fearful or hesitant when taking this trade.',
      'FOMO': 'Fear of missing out drove this trading decision.',
      'Revenge': 'This trade was taken with revenge trading mentality after a previous loss.',
      'Planned': 'This was a well-planned trade following your strategy.',
      'Impulsive': 'This trade was taken impulsively without proper planning.',
    },
    after: {
      'Satisfied': 'You felt satisfied with how this trade played out.',
      'Regretful': 'You regret taking this trade or how you managed it.',
      'Relieved': 'You felt relieved when this trade was closed.',
      'Frustrated': 'This trade left you feeling frustrated.',
      'Learning': 'You gained valuable learning insights from this trade.',
    },
  };

  return descriptions[timing][emotion] || '';
}
