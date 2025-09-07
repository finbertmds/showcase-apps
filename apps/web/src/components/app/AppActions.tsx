import { App } from '@/types';
import {
    ArrowTopRightOnSquareIcon,
    CloudArrowDownIcon,
    CodeBracketIcon,
    PlayIcon,
} from '@heroicons/react/24/outline';

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
      icon: ArrowTopRightOnSquareIcon,
      variant: 'outline' as const,
      show: !!app.appStoreUrl,
    },
    {
      label: 'Play Store',
      href: app.playStoreUrl,
      icon: ArrowTopRightOnSquareIcon,
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
