import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { TimelineView } from '@/components/timeline/TimelineView';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Discover Amazing
            <span className="text-primary-600"> Applications</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Explore a curated collection of innovative apps across all platforms. 
            From mobile to web, discover your next favorite application.
          </p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <TimelineView />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
