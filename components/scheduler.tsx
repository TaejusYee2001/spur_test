"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import ScheduleTest from '@/components/schedule-test';
import { startOfWeek, addDays } from 'date-fns';

interface Event {
  title: string;
  time: string;
  day: number;
  color: string;
  recurringDays: string;
  start_date: string;
}

interface Suite {
  id: string;
  name: string;
}

interface ScheduleProps {
  events: Event[];
  suites: Suite[];
}

interface DayInfo {
  num: number;
  month: number;
  day: string;
  year: number;
}

const Scheduler: React.FC<ScheduleProps> = ({ events = [], suites = [] }) => {
  const [weekStartDate, setWeekStartDate] = useState(new Date());
  const [showScheduleTest, setShowScheduleTest] = useState(false);
  const [days, setDays] = useState<DayInfo[]>([]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Helper functions
  const getDaysForWeek = (startOfWeekDate: Date): DayInfo[] => {
    return Array.from({ length: 7 }, (_, i) => {
      const currentDay = addDays(startOfWeekDate, i);
      return {
        num: currentDay.getDate(),
        month: currentDay.getMonth(),
        day: currentDay.toLocaleString('en-US', { weekday: 'short' }),
        year: currentDay.getFullYear(),
      };
    });
  };

  const parseEventTime = (timeStr: string) => {
    const [time, meridiem] = timeStr.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    const hourIn24 = meridiem === 'PM' && hour !== 12 ? hour + 12 : hour;
    return hourIn24 * 60 + minute;
  };

  const formatHour = (hour: number): string => {
    if (hour === 12) return '12 PM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  const shouldShowEvent = (event: Event, day: DayInfo, hour: number): boolean => {
    const eventTimeInMinutes = parseEventTime(event.time);
    const slotTimeInMinutes = hour * 60;
    const eventDate = new Date(event.start_date);
    const currentMonth = weekStartDate.getMonth();
    
    const recurringDays = event.recurringDays.split(",").map(d => d.toLowerCase());
    const eventMatchesDay = recurringDays.includes(day.day.toLowerCase());
    
    const recurringEventDate = new Date(`${day.year}-${day.month + 1}-${day.num}`);
    const isAfterStartDate = recurringEventDate >= eventDate;

    const isOneTimeEvent = eventDate.getMonth() === currentMonth && 
                          event.day === day.num && 
                          eventTimeInMinutes >= slotTimeInMinutes && 
                          eventTimeInMinutes < slotTimeInMinutes + 60;

    const isRecurringEvent = eventMatchesDay && 
                            eventTimeInMinutes >= slotTimeInMinutes && 
                            eventTimeInMinutes < slotTimeInMinutes + 60 && 
                            isAfterStartDate;

    return isOneTimeEvent || isRecurringEvent;
  };

  // Event handlers
  const handleNavigateWeek = (direction: 'next' | 'previous') => {
    const daysToAdd = direction === 'next' ? 7 : -7;
    const newDate = new Date(weekStartDate);
    newDate.setDate(newDate.getDate() + daysToAdd);
    setWeekStartDate(startOfWeek(newDate));
  };

  // Effects
  useEffect(() => {
    setWeekStartDate(startOfWeek(new Date()));
  }, []);

  useEffect(() => {
    setDays(getDaysForWeek(weekStartDate));
  }, [weekStartDate]);

  if (days.length === 0) return null;

  // Component render functions
  const renderEventCard = (event: Event, idx: number, hour: number, day: DayInfo) => (
    <div 
      key={`${day.num}-${hour}-${event.title}-${idx}`}
      className={`absolute w-full p-1 ${event.color} text-xs rounded border border-blue-800`}
    >
      <div className="font-medium text-blue-800">{event.title}</div>
      <div className="flex items-center text-blue-800 text-xs">
        <Clock className="w-4 h-4 mr-1" />
        {event.time}
      </div>
    </div>
  );

  const renderTimeSlot = (hour: number, day: DayInfo) => (
    <div key={`${day.num}-${hour}`} className="border-l min-h-[40px] relative">
      {events.map((event, idx) => 
        shouldShowEvent(event, day, hour) 
          ? renderEventCard(event, idx, hour, day)
          : null
      )}
    </div>
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Button
              className="px-4 py-2 bg-blue-800 text-white rounded"
              onClick={() => setShowScheduleTest(!showScheduleTest)}
            >
              Schedule Test
            </Button>
            <div className="flex items-center justify-between p-2 w-60 h-9 bg-white border border-gray-300 rounded-md">
              <button
                className="flex items-center justify-center w-4 h-4"
                onClick={() => handleNavigateWeek('previous')}
              >
                <ChevronLeft className="w-3 h-3 text-gray-900" />
              </button>
              <span className="flex-1 text-center text-gray-900 font-medium text-base">
                Week of {weekStartDate.toLocaleDateString()}
              </span>
              <button
                className="flex items-center justify-center w-4 h-4"
                onClick={() => handleNavigateWeek('next')}
              >
                <ChevronRight className="w-3 h-3 text-gray-900" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showScheduleTest && (
        <ScheduleTest 
          isOpen={showScheduleTest} 
          onClose={() => setShowScheduleTest(false)} 
          suites={suites} 
        />
      )}

      <div className="border rounded-lg">
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 text-sm font-medium text-gray-500">PST</div>
          {days.map((day) => (
            <div key={day.num} className="p-2 text-center border-l">
              <div className="text-sm font-medium">{day.num}</div>
              <div className="text-xs text-gray-500">{day.day}</div>
            </div>
          ))}
        </div>

        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b">
              <div className="p-2 text-xs text-gray-500">
                {formatHour(hour)}
              </div>
              {days.map((day) => renderTimeSlot(hour, day))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scheduler;