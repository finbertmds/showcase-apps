import { AuthProvider } from '@/contexts/AuthContext';
import { ApolloWrapper } from '@/lib/apollo-wrapper';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Showcase Apps - Discover Amazing Applications',
  description: 'A modern platform to showcase and discover amazing applications across all platforms.',
  keywords: ['apps', 'showcase', 'discovery', 'mobile', 'web', 'desktop'],
  authors: [{ name: 'Showcase Team' }],
  openGraph: {
    title: 'Showcase Apps - Discover Amazing Applications',
    description: 'A modern platform to showcase and discover amazing applications across all platforms.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Showcase Apps',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Showcase Apps - Discover Amazing Applications',
    description: 'A modern platform to showcase and discover amazing applications across all platforms.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
