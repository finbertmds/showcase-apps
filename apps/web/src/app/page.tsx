import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { TimelineView } from '@/components/timeline/TimelineView';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <MainLayout>
      <PageHeader />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <TimelineView />
        </Suspense>
      </div>
    </MainLayout>
  );
}
