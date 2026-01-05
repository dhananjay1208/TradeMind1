'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Trade, TradingDay } from '@/types';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { PnLSummaryCards } from '@/components/analytics/PnLSummaryCards';
import { StatisticsCards } from '@/components/analytics/StatisticsCards';
import { ExtremesCards } from '@/components/analytics/ExtremesCards';
import { EquityCurve } from '@/components/analytics/EquityCurve';
import { DailyPnLChart } from '@/components/analytics/DailyPnLChart';
import { StatisticsTable } from '@/components/analytics/StatisticsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { startOfWeek, startOfMonth, subDays, format } from 'date-fns';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [tradingDays, setTradingDays] = useState<TradingDay[]>([]);
  const [dateRange, setDateRange] = useState('all'); // 'all', '30', '90', '180'

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (!profile?.onboarding_completed) {
        router.push('/onboarding');
      } else {
        fetchAnalyticsData();
      }
    }
  }, [user, profile, authLoading, router, dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      let startDate = '';
      if (dateRange !== 'all') {
        const daysAgo = parseInt(dateRange);
        startDate = subDays(new Date(), daysAgo).toISOString().split('T')[0];
      }

      // Fetch all closed trades
      let tradesQuery = supabase
        .from('trades')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_closed', true)
        .order('trade_date', { ascending: true });

      if (startDate) {
        tradesQuery = tradesQuery.gte('trade_date', startDate);
      }

      const { data: tradesData, error: tradesError } = await tradesQuery;

      if (tradesError) throw tradesError;
      setTrades(tradesData || []);

      // Fetch trading days
      let daysQuery = supabase
        .from('trading_days')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: true });

      if (startDate) {
        daysQuery = daysQuery.gte('date', startDate);
      }

      const { data: daysData, error: daysError } = await daysQuery;

      if (daysError) throw daysError;
      setTradingDays(daysData || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePeriodStats = (periodTrades: Trade[]) => {
    const closedTrades = periodTrades.filter((t) => t.is_closed);
    const totalTrades = closedTrades.length;
    const winningTrades = closedTrades.filter((t) => t.is_winner === true);
    const losingTrades = closedTrades.filter((t) => t.is_winner === false);

    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalProfit = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalLoss = losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

    const avgProfit =
      winningTrades.length > 0 ? totalProfit / winningTrades.length : 0;
    const avgLoss =
      losingTrades.length > 0 ? totalLoss / losingTrades.length : 0;

    const maxProfit =
      closedTrades.length > 0
        ? Math.max(...closedTrades.map((t) => t.pnl || 0))
        : 0;
    const maxLoss =
      closedTrades.length > 0
        ? Math.min(...closedTrades.map((t) => t.pnl || 0))
        : 0;

    const hitRatio =
      totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
    const rrRatio = avgLoss !== 0 ? Math.abs(avgProfit / avgLoss) : 0;
    const roi = profile?.current_capital
      ? (totalPnL / profile.current_capital) * 100
      : 0;
    const profitFactor =
      totalLoss !== 0 ? Math.abs(totalProfit / totalLoss) : 0;

    return {
      totalPnL,
      totalTrades,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      hitRatio,
      avgProfit,
      avgLoss,
      maxProfit,
      maxLoss,
      rrRatio,
      roi,
      profitFactor,
    };
  };

  const getTodayTrades = () => {
    const today = new Date().toISOString().split('T')[0];
    return trades.filter((t) => t.trade_date === today);
  };

  const getWeekTrades = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
      .toISOString()
      .split('T')[0];
    return trades.filter((t) => t.trade_date >= weekStart);
  };

  const getMonthTrades = () => {
    const monthStart = startOfMonth(new Date()).toISOString().split('T')[0];
    return trades.filter((t) => t.trade_date >= monthStart);
  };

  const getEquityCurveData = () => {
    const dailyPnL = new Map<string, number>();

    trades.forEach((trade) => {
      const date = trade.trade_date;
      dailyPnL.set(date, (dailyPnL.get(date) || 0) + (trade.pnl || 0));
    });

    const sortedDates = Array.from(dailyPnL.keys()).sort();
    let cumulativePnL = 0;

    return sortedDates.map((date) => {
      cumulativePnL += dailyPnL.get(date) || 0;
      return {
        date,
        cumulativePnL,
        displayDate: format(new Date(date), 'MMM dd'),
      };
    });
  };

  const getDailyPnLData = () => {
    const dailyPnL = new Map<string, number>();

    // Get last 30 days
    const endDate = new Date();
    const startDate = subDays(endDate, 29);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyPnL.set(dateStr, 0);
    }

    trades.forEach((trade) => {
      const date = trade.trade_date;
      if (dailyPnL.has(date)) {
        dailyPnL.set(date, (dailyPnL.get(date) || 0) + (trade.pnl || 0));
      }
    });

    const sortedDates = Array.from(dailyPnL.keys()).sort();

    return sortedDates.map((date) => ({
      date,
      pnl: dailyPnL.get(date) || 0,
      displayDate: format(new Date(date), 'MMM dd'),
    }));
  };

  const getExtremesData = () => {
    const allPnLs = trades.map((t) => ({ pnl: t.pnl || 0, symbol: t.symbol }));
    const maxProfitTrade = allPnLs.reduce(
      (max, t) => (t.pnl > max.pnl ? t : max),
      { pnl: 0, symbol: '' }
    );
    const maxLossTrade = allPnLs.reduce(
      (min, t) => (t.pnl < min.pnl ? t : min),
      { pnl: 0, symbol: '' }
    );

    // Calculate daily totals
    const dailyTotals = new Map<string, number>();
    trades.forEach((trade) => {
      const date = trade.trade_date;
      dailyTotals.set(date, (dailyTotals.get(date) || 0) + (trade.pnl || 0));
    });

    const dailyArray = Array.from(dailyTotals.entries()).map(([date, pnl]) => ({
      date,
      pnl,
    }));

    const bestDay = dailyArray.reduce(
      (max, d) => (d.pnl > max.pnl ? d : max),
      { date: '', pnl: 0 }
    );
    const worstDay = dailyArray.reduce(
      (min, d) => (d.pnl < min.pnl ? d : min),
      { date: '', pnl: 0 }
    );

    return {
      maxProfit: maxProfitTrade.pnl,
      maxProfitSymbol: maxProfitTrade.symbol,
      maxLoss: maxLossTrade.pnl,
      maxLossSymbol: maxLossTrade.symbol,
      bestDay: bestDay.pnl,
      bestDayDate: bestDay.date,
      worstDay: worstDay.pnl,
      worstDayDate: worstDay.date,
    };
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const todayStats = calculatePeriodStats(getTodayTrades());
  const weekStats = calculatePeriodStats(getWeekTrades());
  const monthStats = calculatePeriodStats(getMonthTrades());
  const allTimeStats = calculatePeriodStats(trades);

  const pnlSummaryData = {
    today: {
      pnl: todayStats.totalPnL,
      roi: todayStats.roi,
      trades: todayStats.totalTrades,
    },
    week: {
      pnl: weekStats.totalPnL,
      roi: weekStats.roi,
      trades: weekStats.totalTrades,
    },
    month: {
      pnl: monthStats.totalPnL,
      roi: monthStats.roi,
      trades: monthStats.totalTrades,
    },
    allTime: {
      pnl: allTimeStats.totalPnL,
      roi: allTimeStats.roi,
      trades: allTimeStats.totalTrades,
    },
  };

  const statisticsData = {
    hitRatio: allTimeStats.hitRatio,
    avgProfit: allTimeStats.avgProfit,
    avgLoss: allTimeStats.avgLoss,
    rrRatio: allTimeStats.rrRatio,
  };

  const extremesData = getExtremesData();
  const equityCurveData = getEquityCurveData();
  const dailyPnLData = getDailyPnLData();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 pb-20 md:pb-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Track your trading performance and statistics
              </p>
            </div>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="180">Last 180 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">P&L Summary</h2>
                <PnLSummaryCards
                  today={pnlSummaryData.today}
                  week={pnlSummaryData.week}
                  month={pnlSummaryData.month}
                  allTime={pnlSummaryData.allTime}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Key Statistics</h2>
                <StatisticsCards data={statisticsData} />
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Extremes</h2>
                <ExtremesCards data={extremesData} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <EquityCurve data={equityCurveData} />
                <DailyPnLChart data={dailyPnLData} />
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              <StatisticsTable
                today={todayStats}
                week={weekStats}
                month={monthStats}
                allTime={allTimeStats}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <EquityCurve data={equityCurveData} />
                <DailyPnLChart data={dailyPnLData} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
