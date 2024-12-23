"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from "lucide-react";
import ScheduleTest from '@/components/schedule-test';
import { startOfWeek, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from "lucide-react";

type Event = {
  title: string;
  time: string;
  day: number;
  color: string;
  recurringDays: string;
  start_date: string; 
};

type Suite = {
  id: string; 
  name: string;
}

interface ScheduleProps {
  events: Event[];
  suites: Suite[]; 
}


const Scheduler: React.FC<ScheduleProps> = ({ events = [], suites = [] }) => {
  const [weekStartDate, setWeekStartDate] = useState(new Date());
  const [showScheduleTest, setShowScheduleTest] = useState(false);
  const [days, setDays] = useState<any[]>([]);

  const getDaysForWeek = (startOfWeekDate: Date) => {
    const daysArray = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(startOfWeekDate, i);
      daysArray.push({
        num: currentDay.getDate(),
        month: currentDay.getMonth(),
        day: currentDay.toLocaleString('en-US', { weekday: 'short' }),
        year: currentDay.getFullYear(),
      });
    }
    return daysArray;
  };

  useEffect(() => {
    const calculatedDays = getDaysForWeek(weekStartDate);
    setDays(calculatedDays);
  }, [weekStartDate]); 

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleNavigateWeek = (direction: 'next' | 'previous') => {
    const newDate =
      direction === 'next'
        ? new Date(weekStartDate.setDate(weekStartDate.getDate() + 7))
        : new Date(weekStartDate.setDate(weekStartDate.getDate() - 7));

    setWeekStartDate(startOfWeek(newDate));
  };

  const toggleScheduleTest = () => setShowScheduleTest(!showScheduleTest);

  useEffect(() => {
    setWeekStartDate(startOfWeek(new Date()));
  }, []);

  if (days.length === 0) return null;

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Button
              className="px-4 py-2 bg-blue-800 text-white rounded"
              onClick={toggleScheduleTest}
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

      {showScheduleTest && <ScheduleTest isOpen={showScheduleTest} onClose={toggleScheduleTest} suites={suites} />}

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
                {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
              {days.map((day) => (
                <div key={`${day.num}-${hour}`} className="border-l min-h-[40px] relative">
                  {events.map((event, idx) => {
                    const eventTimeParts = event.time.split(' ');
                    const [eventHour, eventMinute] = eventTimeParts[0].split(':').map(Number);
                    const eventAMPM = eventTimeParts[1];

                    const eventHourIn24 = eventAMPM === 'PM' && eventHour !== 12 ? eventHour + 12 : eventHour;
                    const eventTimeInMinutes = eventHourIn24 * 60 + eventMinute;

                    const slotTimeInMinutes = hour * 60;
                    const eventDate = new Date(event.start_date);
                    const eventMonth = eventDate.getMonth();
                    const currentMonth = weekStartDate.getMonth();
                    
                    const daysArray = event.recurringDays.split(",").map(day => day.toLowerCase())
                    const eventMatchesDay = daysArray.includes(day.day.toLowerCase());

                    const recurringEventDate = new Date(
                      `${day.year}-${day.month + 1}-${day.num}`
                    );
                    console.log(recurringEventDate)
                    console.log(eventDate)

                    const isAfterStartDate = recurringEventDate >= eventDate;
                    console.log(isAfterStartDate)

                    if ((eventMonth === currentMonth && event.day === day.num && eventTimeInMinutes >= slotTimeInMinutes && eventTimeInMinutes < slotTimeInMinutes + 60) 
                      || (eventMatchesDay&& eventTimeInMinutes >= slotTimeInMinutes && eventTimeInMinutes < slotTimeInMinutes + 60 && isAfterStartDate)) {
                      return (
                        <div
                          key={idx}
                          className={`absolute w-full p-1 ${event.color} text-xs rounded border border-blue-800`}
                        >
                          <div className="font-medium text-blue-800">{event.title}</div>
                          <div className="flex items-center text-blue-800 text-xs">
                            <Clock className="w-4 h-4 mr-1" />
                            {event.time}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
