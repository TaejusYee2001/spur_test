import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface ScheduledTest {
  start_date: string;
  test_name: string;
  weekly_schedule: string;
}

export interface FormattedEvent {
  day: number;
  time: string;
  title: string;
  color: string;
  recurringDays: string;
  start_date: string;
}

const formatScheduledTests = (tests: ScheduledTest[]): FormattedEvent[] => {
  return tests.map((test) => {
    const testDate = new Date(test.start_date);
    const testTime = new Date(test.start_date);
    const testTitle = test.test_name;
  
    const testDay = testDate.getDate();
  
    let hours = testTime.getHours();
    let minutes = testTime.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
    const testTimeStr = `${hours}:${formattedMinutes} ${ampm}`;
  
    return {
      day: testDay,
      time: testTimeStr,
      title: testTitle,
      color: 'bg-blue-200',
      recurringDays: test.weekly_schedule,
      start_date: test.start_date
    };
  });
};

export const useScheduledTests = () => {
  const supabase = createClient();

  return useQuery({
    queryKey: ['scheduled-tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_tests')
        .select();

      if (error) throw error;
      return formatScheduledTests(data || []);
    },
  });
};