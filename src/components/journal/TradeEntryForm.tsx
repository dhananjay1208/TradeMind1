'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Trade, EmotionBefore, EmotionAfter } from '@/types';
import { calculatePnL } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Upload } from 'lucide-react';

interface TradeEntryFormProps {
  onTradeAdded?: () => void;
  editingTrade?: Trade | null;
  onCancel?: () => void;
}

// Common Indian stocks for suggestions
const COMMON_STOCKS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR',
  'ICICIBANK', 'KOTAKBANK', 'SBIN', 'BHARTIARTL', 'ITC',
  'AXISBANK', 'LT', 'ASIANPAINT', 'BAJFINANCE', 'MARUTI',
  'TITAN', 'WIPRO', 'ULTRACEMCO', 'SUNPHARMA', 'NESTLEIND',
  'NIFTY', 'BANKNIFTY', 'FINNIFTY'
];

export function TradeEntryForm({ onTradeAdded, editingTrade, onCancel }: TradeEntryFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  // Form state
  const [tradeDate, setTradeDate] = useState('');
  const [tradeTime, setTradeTime] = useState('');
  const [symbol, setSymbol] = useState('');
  const [tradeType, setTradeType] = useState<'LONG' | 'SHORT'>('LONG');
  const [quantity, setQuantity] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [broker, setBroker] = useState<'ZERODHA' | 'GROWW' | 'OTHER'>('ZERODHA');
  const [emotionBefore, setEmotionBefore] = useState<EmotionBefore | ''>('');
  const [emotionAfter, setEmotionAfter] = useState<EmotionAfter | ''>('');
  const [notes, setNotes] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

  // Calculated fields
  const [pnl, setPnl] = useState(0);
  const [isWinner, setIsWinner] = useState(false);

  // Symbol suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState<string[]>([]);

  // Initialize form with today's date and current time
  useEffect(() => {
    if (!editingTrade) {
      const now = new Date();
      setTradeDate(now.toISOString().split('T')[0]);
      setTradeTime(now.toTimeString().slice(0, 5));
    }
  }, [editingTrade]);

  // Load editing trade data
  useEffect(() => {
    if (editingTrade) {
      setTradeDate(editingTrade.trade_date);
      setTradeTime(editingTrade.trade_time || '');
      setSymbol(editingTrade.symbol);
      setTradeType(editingTrade.trade_type);
      setQuantity(editingTrade.quantity.toString());
      setEntryPrice(editingTrade.entry_price.toString());
      setExitPrice(editingTrade.exit_price?.toString() || '');
      setBroker(editingTrade.broker);
      setEmotionBefore((editingTrade.emotion_before as EmotionBefore) || '');
      setEmotionAfter((editingTrade.emotion_after as EmotionAfter) || '');
      setNotes(editingTrade.notes || '');
    }
  }, [editingTrade]);

  // Auto-calculate P&L
  useEffect(() => {
    if (entryPrice && exitPrice && quantity) {
      const entry = parseFloat(entryPrice);
      const exit = parseFloat(exitPrice);
      const qty = parseFloat(quantity);

      if (!isNaN(entry) && !isNaN(exit) && !isNaN(qty)) {
        const calculatedPnL = calculatePnL(tradeType, entry, exit, qty);
        setPnl(calculatedPnL);
        setIsWinner(calculatedPnL > 0);
      }
    }
  }, [entryPrice, exitPrice, quantity, tradeType]);

  // Filter stock suggestions
  useEffect(() => {
    if (symbol) {
      const filtered = COMMON_STOCKS.filter(stock =>
        stock.toLowerCase().includes(symbol.toLowerCase())
      );
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks([]);
    }
  }, [symbol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add trades',
        variant: 'destructive',
      });
      return;
    }

    // Validation
    if (!tradeDate || !symbol || !quantity || !entryPrice || !exitPrice) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      // Get today's trading day if exists
      let tradingDayId = null;
      const { data: dayData } = await supabase
        .from('trading_days')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', tradeDate)
        .single();

      if (dayData) {
        tradingDayId = dayData.id;
      }

      const tradeData = {
        user_id: user.id,
        trading_day_id: tradingDayId,
        trade_date: tradeDate,
        trade_time: tradeTime || null,
        symbol: symbol.toUpperCase(),
        trade_type: tradeType,
        quantity: parseFloat(quantity),
        entry_price: parseFloat(entryPrice),
        exit_price: parseFloat(exitPrice),
        pnl,
        is_winner: isWinner,
        is_closed: true,
        broker,
        emotion_before: emotionBefore || null,
        emotion_after: emotionAfter || null,
        notes: notes || null,
        screenshot_url: null, // TODO: Implement file upload
        updated_at: new Date().toISOString(),
      };

      if (editingTrade) {
        // Update existing trade
        const { error } = await supabase
          .from('trades')
          .update(tradeData)
          .eq('id', editingTrade.id);

        if (error) throw error;

        toast({
          title: 'Trade Updated',
          description: 'Your trade has been updated successfully',
        });
      } else {
        // Insert new trade
        const { error } = await supabase
          .from('trades')
          .insert([tradeData]);

        if (error) throw error;

        toast({
          title: 'Trade Added',
          description: `${symbol.toUpperCase()} ${tradeType} trade logged successfully`,
        });

        // Reset form
        resetForm();
      }

      // Trigger auto-update of trading_day statistics via database function
      if (tradingDayId) {
        await supabase.rpc('update_trading_day_stats', {
          day_id: tradingDayId
        });
      }

      if (onTradeAdded) {
        onTradeAdded();
      }
    } catch (error) {
      console.error('Error saving trade:', error);
      toast({
        title: 'Error',
        description: 'Failed to save trade. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    const now = new Date();
    setTradeDate(now.toISOString().split('T')[0]);
    setTradeTime(now.toTimeString().slice(0, 5));
    setSymbol('');
    setTradeType('LONG');
    setQuantity('');
    setEntryPrice('');
    setExitPrice('');
    setBroker('ZERODHA');
    setEmotionBefore('');
    setEmotionAfter('');
    setNotes('');
    setScreenshotFile(null);
    setPnl(0);
    setIsWinner(false);
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingTrade ? 'Edit Trade' : 'Log New Trade'}</CardTitle>
        <CardDescription>
          {editingTrade ? 'Update trade details' : 'Manually enter your trade details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trade-date">Date *</Label>
              <Input
                id="trade-date"
                type="date"
                value={tradeDate}
                onChange={(e) => setTradeDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trade-time">Time</Label>
              <Input
                id="trade-time"
                type="time"
                value={tradeTime}
                onChange={(e) => setTradeTime(e.target.value)}
              />
            </div>
          </div>

          {/* Symbol and Trade Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 relative">
              <Label htmlFor="symbol">Symbol *</Label>
              <Input
                id="symbol"
                type="text"
                placeholder="e.g., RELIANCE, NIFTY"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                required
              />
              {showSuggestions && filteredStocks.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredStocks.slice(0, 10).map((stock) => (
                    <button
                      key={stock}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
                      onClick={() => {
                        setSymbol(stock);
                        setShowSuggestions(false);
                      }}
                    >
                      {stock}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="trade-type">Trade Type *</Label>
              <Select value={tradeType} onValueChange={(value) => setTradeType(value as 'LONG' | 'SHORT')}>
                <SelectTrigger id="trade-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LONG">LONG (Buy)</SelectItem>
                  <SelectItem value="SHORT">SHORT (Sell)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quantity and Prices */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                placeholder="100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entry-price">Entry Price (₹) *</Label>
              <Input
                id="entry-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="100.00"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exit-price">Exit Price (₹) *</Label>
              <Input
                id="exit-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="105.00"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                required
              />
            </div>
          </div>

          {/* P&L Display */}
          {pnl !== 0 && (
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Calculated P&L:</span>
                <span className={`text-lg font-bold ${pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  <span className="text-sm ml-2">
                    ({isWinner ? 'Winner' : 'Loser'})
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Broker */}
          <div className="space-y-2">
            <Label htmlFor="broker">Broker</Label>
            <Select value={broker} onValueChange={(value) => setBroker(value as 'ZERODHA' | 'GROWW' | 'OTHER')}>
              <SelectTrigger id="broker">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ZERODHA">Zerodha</SelectItem>
                <SelectItem value="GROWW">Groww</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Emotions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emotion-before">Emotion Before Trade</Label>
              <Select value={emotionBefore} onValueChange={(value) => setEmotionBefore(value as EmotionBefore)}>
                <SelectTrigger id="emotion-before">
                  <SelectValue placeholder="Select emotion..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Confident">Confident</SelectItem>
                  <SelectItem value="Fearful">Fearful</SelectItem>
                  <SelectItem value="FOMO">FOMO</SelectItem>
                  <SelectItem value="Revenge">Revenge</SelectItem>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="Impulsive">Impulsive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emotion-after">Emotion After Trade</Label>
              <Select value={emotionAfter} onValueChange={(value) => setEmotionAfter(value as EmotionAfter)}>
                <SelectTrigger id="emotion-after">
                  <SelectValue placeholder="Select emotion..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Satisfied">Satisfied</SelectItem>
                  <SelectItem value="Regretful">Regretful</SelectItem>
                  <SelectItem value="Relieved">Relieved</SelectItem>
                  <SelectItem value="Frustrated">Frustrated</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Learning</Label>
            <Textarea
              id="notes"
              placeholder="What was your setup? What did you learn from this trade?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Screenshot Upload (UI only for now) */}
          <div className="space-y-2">
            <Label htmlFor="screenshot">Screenshot (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
                className="flex-1"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            {screenshotFile && (
              <p className="text-xs text-muted-foreground">
                Selected: {screenshotFile.name}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {editingTrade ? 'Update Trade' : 'Save Trade'}
            </Button>
            {editingTrade && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
