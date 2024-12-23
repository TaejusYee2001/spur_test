import Scheduler from "@/components/scheduler";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface Event {
  day: number; 
  time: string; 
  title: string; 
  color: string; 
}

interface Suite {
  id: string;
  name: string;
}

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch scheduled tests for user
  const { data: scheduled_tests } = await supabase.from("scheduled_tests").select();

  const formatted_tests: Event[] = scheduled_tests?.map((test) => {
    const testDate = new Date(test.start_date);
    const testTime = new Date(test.start_date);
    const testTitle = test.test_name;
  
    const testDay = testDate.getDate(); // Extract day from start_date
  
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
      color: 'bg-blue-500', // You can customize the color
    };
  }) || [];

  // Fetch all available test suites for user
  const { data: test_suites } = await supabase.from("test_suites").select();

  const formatted_test_suites = (test_suites: any[]) => {
    return test_suites?.map(suite => {
      return {
        id: suite.id,
        name: suite.test_name, // Rename 'test_name' to 'name'
      };
    }) || [];
  };

  const formatted_suites = test_suites ? formatted_test_suites(test_suites) : [];

  return (
    <div className="w-[100%]">
      <Scheduler events={formatted_tests} suites={formatted_suites}/>
    </div>
  );
}
