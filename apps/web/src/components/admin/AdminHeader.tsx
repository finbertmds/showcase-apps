'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export function AdminHeader() {
  const { user } = useUser();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-xl font-bold text-primary-600">
              Admin Dashboard
            </Link>
            <span className="text-sm text-gray-500">
              Welcome back, {user?.firstName || 'Admin'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              View Site
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  );
}
