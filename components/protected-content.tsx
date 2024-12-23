'use client';

import { useScheduledTests } from '@/hooks/use-scheduled-tests';
import { useTestSuites } from '@/hooks/use-test-suites';
import Scheduler from '@/components/scheduler';

export default function ProtectedContent() {
  const { data: events, isLoading: eventsLoading } = useScheduledTests();
  const { data: suites, isLoading: suitesLoading } = useTestSuites();

  if (eventsLoading || suitesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[100%]">
      <Scheduler events={events || []} suites={suites || []} />
    </div>
  );
}