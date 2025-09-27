'use client';

import {
  BuildingOfficeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  Squares2X2Icon,
  UsersIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Apps', href: '/admin/apps', icon: Squares2X2Icon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Organizations', href: '/admin/organizations', icon: BuildingOfficeIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

const settingsNavigation = [
  { name: 'Enums', href: '/admin/settings/enums', icon: Cog6ToothIcon },
];

interface AdminSidebarProps {
  collapsed: boolean;
}

export function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`fixed inset-y-0 left-0 bg-white shadow-sm border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'
      }`}>
      <div className="flex flex-col h-full">
        <nav className={`flex-1 py-6 space-y-2 ${collapsed ? 'px-2' : 'px-4'}`}>
          {navigation.map((item) => {
            const isActive = item.href === '/admin' ? pathname === item.href : pathname.includes(item.href);
            const isSettingsActive = item.href === '/admin/settings' && pathname.startsWith('/admin/settings');

            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    'group flex items-center rounded-md transition-colors',
                    collapsed ? 'px-2 py-2 justify-center' : 'px-3 py-2',
                    'text-sm font-medium',
                    isActive || isSettingsActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon
                    className={clsx(
                      'h-5 w-5 flex-shrink-0',
                      collapsed ? '' : 'mr-3',
                      isActive || isSettingsActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>

                {/* Settings submenu */}
                {item.href === '/admin/settings' && !collapsed && isSettingsActive && (
                  <div className="ml-6 mt-2 space-y-1">
                    {settingsNavigation.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={clsx(
                            'group flex items-center rounded-md transition-colors px-3 py-2 text-sm font-medium',
                            isSubActive
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          )}
                        >
                          <subItem.icon
                            className={clsx(
                              'h-4 w-4 flex-shrink-0 mr-2',
                              isSubActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                            )}
                          />
                          <span className="truncate">{subItem.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
