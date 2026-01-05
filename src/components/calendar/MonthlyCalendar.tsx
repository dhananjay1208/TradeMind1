'use client';

import { useState } from 'react';
import { TradingDay, Profile } from '@/types';
import { DayCard } from './DayCard';
import { DayDetailModal } from './DayDetailModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  addMonths,
  subMonths,
} from 'date-fns';

interface MonthlyCalendarProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  tradingDays: TradingDay[];
  profile: Profile;
}

export function MonthlyCalendar({
  currentDate,
  onMonthChange,
  tradingDays,
  profile,
}: MonthlyCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<TradingDay | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  // Create a map of trading days by date for quick lookup
  const tradingDayMap = new Map<string, TradingDay>();
  tradingDays.forEach((td) => {
    tradingDayMap.set(td.date, td);
  });

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const tradingDay = tradingDayMap.get(dateStr);
    if (tradingDay) {
      setSelectedDay(tradingDay);
      setModalOpen(true);
    }
  };

  const handlePreviousMonth = () => {
    onMonthChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    onMonthChange(new Date());
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const tradingDay = tradingDayMap.get(dateStr) || null;
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <DayCard
                  key={index}
                  date={day}
                  tradingDay={tradingDay}
                  onClick={() => handleDayClick(day)}
                  isCurrentMonth={isCurrentMonth}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Profit Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Loss Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span>Breakeven (±100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-background border rounded"></div>
              <span>No Trading</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Detail Modal */}
      <DayDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tradingDay={selectedDay}
        profile={profile}
      />
    </>
  );
}
