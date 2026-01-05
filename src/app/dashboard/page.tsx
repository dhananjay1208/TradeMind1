'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { TradingDay, Mood, Trade } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { QuoteCard } from '@/components/dashboard/QuoteCard';
import { RulesChecklist } from '@/components/dashboard/RulesChecklist';
import { RiskLimitsCard } from '@/components/dashboard/RiskLimitsCard';
import { MoodSelector } from '@/components/dashboard/MoodSelector';
import { ReadyToTradeButton } from '@/components/dashboard/ReadyToTradeButton';
import { TodayPnLCard } from '@/components/dashboard/TodayPnLCard';
import { RiskMeter } from '@/components/dashboard/RiskMeter';
import { TargetProgress } from '@/components/dashboard/TargetProgress';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [tradingDay, setTradingDay] = useState<TradingDay | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [marketNotes, setMarketNotes] = useState('');
  const [rulesChecked, setRulesChecked] = useState(false);
  const [startingTradingDay, setStartingTradingDay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRiskAlert, setLastRiskAlert] = useState<number>(0);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (!profile?.onboarding_completed) {
        router.push('/onboarding');
      } else {
        fetchTodayData();
      }
    }
  }, [user, profile, authLoading, router]);

  useEffect(() => {
    if (tradingDay && tradingDay.is_active) {
      // Set up real-time subscription for trades
      const subscription = supabase
        .channel('trades_channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'trades',
            filter: `trading_day_id=eq.${tradingDay.id}`,
          },
          () => {
            fetchTrades();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [tradingDay]);

  // Monitor risk usage and show alerts
  useEffect(() => {
    if (profile && tradingDay && trades.length > 0) {
      const totalPnL = calculateTotalPnL();
      if (totalPnL < 0) {
        const usedRisk = Math.abs(totalPnL);
        const percentage = (usedRisk / profile.max_daily_loss) * 100;

        // Alert at 50%, 75%, and 100%
        if (percentage >= 100 && lastRiskAlert < 100) {
          toast({
            title: 'DAILY RISK LIMIT REACHED!',
            description: 'Stop trading immediately. You have reached your maximum daily loss limit.',
            variant: 'destructive',
          });
          setLastRiskAlert(100);
        } else if (percentage >= 75 && lastRiskAlert < 75) {
          toast({
            title: 'Warning: 75% Risk Limit',
            description: 'You have used 75% of your daily risk limit. Consider stopping for the day.',
            variant: 'destructive',
          });
          setLastRiskAlert(75);
        } else if (percentage >= 50 && lastRiskAlert < 50) {
          toast({
            title: 'Caution: 50% Risk Limit',
            description: 'You have used 50% of your daily risk limit. Be cautious with new trades.',
          });
          setLastRiskAlert(50);
        }
      }
    }
  }, [trades, profile, tradingDay, lastRiskAlert, toast]);

  // Check if daily target achieved
  useEffect(() => {
    if (profile && tradingDay && tradingDay.is_active) {
      const totalPnL = calculateTotalPnL();
      if (totalPnL >= profile.daily_target && totalPnL > 0) {
        toast({
          title: 'Daily Target Achieved!',
          description: `Congratulations! You've reached your daily target of ${profile.daily_target.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}. Consider stopping for the day.`,
        });
      }
    }
  }, [trades, profile, tradingDay]);

  const fetchTodayData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Fetch today's trading day
      const { data: dayData, error: dayError } = await supabase
        .from('trading_days')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .single();

      if (dayError && dayError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned"
        throw dayError;
      }

      if (dayData) {
        setTradingDay(dayData);
        if (dayData.is_active) {
          await fetchTrades();
        }
      }
    } catch (error) {
      console.error('Error fetching today data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please refresh the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTrades = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user?.id)
        .eq('trade_date', today)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrades(data || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  const handleStartTrading = async () => {
    if (!user || !profile) return;

    try {
      setStartingTradingDay(true);
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();

      // Create or update trading day
      const { data, error } = await supabase
        .from('trading_days')
        .upsert(
          {
            user_id: user.id,
            date: today,
            opening_capital: profile.current_capital,
            pre_market_mood: selectedMood,
            pre_market_notes: marketNotes,
            rules_acknowledged: true,
            rules_acknowledged_at: now,
            is_active: true,
            updated_at: now,
          },
          {
            onConflict: 'user_id,date',
          }
        )
        .select()
        .single();

      if (error) throw error;

      setTradingDay(data);
      toast({
        title: 'Trading Day Started!',
        description: 'Good luck! Trade with discipline and stick to your rules.',
      });
    } catch (error) {
      console.error('Error starting trading day:', error);
      toast({
        title: 'Error',
        description: 'Failed to start trading day. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setStartingTradingDay(false);
    }
  };

  const calculateTotalPnL = () => {
    return trades.reduce((sum, trade) => {
      if (trade.pnl !== null) {
        return sum + trade.pnl;
      }
      return sum;
    }, 0);
  };

  const calculateStats = () => {
    const totalPnL = calculateTotalPnL();
    const totalTrades = trades.filter((t) => t.is_closed).length;
    const winningTrades = trades.filter((t) => t.is_winner === true).length;
    const losingTrades = trades.filter((t) => t.is_winner === false).length;

    return {
      totalPnL,
      totalTrades,
      winningTrades,
      losingTrades,
    };
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const stats = calculateStats();
  const isReadyToTrade = rulesChecked && selectedMood !== null;
  const hasStartedTrading = tradingDay?.is_active;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 pb-20 md:pb-6">
        {!hasStartedTrading ? (
          // Pre-Trading Ritual
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h1 className="text-3xl font-bold mb-2">Daily Discipline Ritual</h1>
              <p className="text-muted-foreground">
                Complete your pre-market routine before starting to trade
              </p>
            </div>

            <QuoteCard />

            <div className="grid md:grid-cols-2 gap-6">
              <RulesChecklist onAllRulesChecked={setRulesChecked} />
              <RiskLimitsCard profile={profile} />
            </div>

            <MoodSelector
              selectedMood={selectedMood}
              onMoodChange={setSelectedMood}
              notes={marketNotes}
              onNotesChange={setMarketNotes}
            />

            <ReadyToTradeButton
              onClick={handleStartTrading}
              disabled={!isReadyToTrade}
              loading={startingTradingDay}
            />
          </div>
        ) : (
          // Live Trading Dashboard
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Live Trading Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor your performance and stick to your plan
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TodayPnLCard
                  pnl={stats.totalPnL}
                  trades={stats.totalTrades}
                  winningTrades={stats.winningTrades}
                  losingTrades={stats.losingTrades}
                  profile={profile}
                />
              </div>

              <div className="lg:col-span-2 space-y-6">
                <RiskMeter
                  currentLoss={Math.min(stats.totalPnL, 0)}
                  maxDailyLoss={profile.max_daily_loss}
                  profile={profile}
                />
                <TargetProgress currentPnL={stats.totalPnL} profile={profile} />
              </div>
            </div>

            <QuoteCard />

            <div className="grid md:grid-cols-2 gap-6">
              <RulesChecklist onAllRulesChecked={() => {}} />
              <RiskLimitsCard profile={profile} />
            </div>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
