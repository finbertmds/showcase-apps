import { AppDetailView } from '@/components/app/AppDetailView';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface AppDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: AppDetailPageProps): Promise<Metadata> {
  // In a real implementation, you would fetch the app data here
  // For now, we'll use the slug as a fallback
  const title = `${params.slug} - Showcase Apps`;
  
  return {
    title,
    description: `Discover ${params.slug} on Showcase Apps - a curated collection of amazing applications.`,
    openGraph: {
      title,
      description: `Discover ${params.slug} on Showcase Apps - a curated collection of amazing applications.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: `Discover ${params.slug} on Showcase Apps - a curated collection of amazing applications.`,
    },
  };
}

export default function AppDetailPage({ params }: AppDetailPageProps) {
  if (!params.slug) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AppDetailView slug={params.slug} />
      </main>

      <Footer />
    </div>
  );
}
