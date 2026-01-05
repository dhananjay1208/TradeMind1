'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { TradingDay } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { MonthlyCalendar } from '@/components/calendar/MonthlyCalendar';
import { MonthlySummary } from '@/components/calendar/MonthlySummary';
import { Loader2 } from 'lucide-react';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export default function CalendarPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [tradingDays, setTradingDays] = useState<TradingDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (!profile?.onboarding_completed) {
        router.push('/onboarding');
      } else {
        fetchMonthData();
      }
    }
  }, [user, profile, authLoading, router, currentDate]);

  const fetchMonthData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get start and end of current month
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      const startDateStr = format(monthStart, 'yyyy-MM-dd');
      const endDateStr = format(monthEnd, 'yyyy-MM-dd');

      // Fetch all trading days for the month
      const { data, error } = await supabase
        .from('trading_days')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('date', { ascending: true });

      if (error) throw error;
      setTradingDays(data || []);
    } catch (error) {
      console.error('Error fetching month data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load calendar data. Please refresh the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const monthName = format(currentDate, 'MMMM');
  const year = currentDate.getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 pb-20 md:pb-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Trading Calendar</h1>
            <p className="text-muted-foreground">
              View your monthly trading performance at a glance
            </p>
          </div>

          {/* Monthly Summary */}
          <MonthlySummary
            tradingDays={tradingDays}
            profile={profile}
            monthName={monthName}
            year={year}
          />

          {/* Monthly Calendar */}
          <MonthlyCalendar
            currentDate={currentDate}
            onMonthChange={handleMonthChange}
            tradingDays={tradingDays}
            profile={profile}
          />
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
