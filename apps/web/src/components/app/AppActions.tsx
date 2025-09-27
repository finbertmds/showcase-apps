import { App } from '@/types';
import {
  ArrowTopRightOnSquareIcon,
  CloudArrowDownIcon,
  CodeBracketIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

// App Store Icon
const AppStoreIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

// Play Store Icon
const PlayStoreIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
  </svg>
);

interface AppActionsProps {
  app: App;
}

export function AppActions({ app }: AppActionsProps) {
  const actions = [
    {
      label: 'Try Demo',
      href: app.demoUrl,
      icon: PlayIcon,
      variant: 'primary' as const,
      show: !!app.demoUrl,
    },
    {
      label: 'Download',
      href: app.downloadUrl,
      icon: CloudArrowDownIcon,
      variant: 'secondary' as const,
      show: !!app.downloadUrl,
    },
    {
      label: 'View Website',
      href: app.website,
      icon: ArrowTopRightOnSquareIcon,
      variant: 'outline' as const,
      show: !!app.website,
    },
    {
      label: 'View Source',
      href: app.repository,
      icon: CodeBracketIcon,
      variant: 'outline' as const,
      show: !!app.repository,
    },
    {
      label: 'App Store',
      href: app.appStoreUrl,
      icon: AppStoreIcon,
      variant: 'outline' as const,
      show: !!app.appStoreUrl,
    },
    {
      label: 'Play Store',
      href: app.playStoreUrl,
      icon: PlayStoreIcon,
      variant: 'outline' as const,
      show: !!app.playStoreUrl,
    },
  ].filter(action => action.show);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Get Started</h3>
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const baseClasses = "inline-flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors";

          const variantClasses = {
            primary: "bg-primary-600 text-white hover:bg-primary-700",
            secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
            outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
          };

          return (
            <a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseClasses} ${variantClasses[action.variant]}`}
            >
              <Icon className="h-4 w-4" />
              <span>{action.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
