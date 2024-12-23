import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface TestSuite {
    id: string;
    test_name: string;
  }
  
  export interface FormattedSuite {
    id: string;
    name: string;
  }
  
  export const useTestSuites = () => {
    const supabase = createClient();
  
    return useQuery({
      queryKey: ['test-suites'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('test_suites')
          .select();
  
        if (error) throw error;
  
        return data?.map(suite => ({
          id: suite.id,
          name: suite.test_name,
        })) || [];
      },
    });
  };
  