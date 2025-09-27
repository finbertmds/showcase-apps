
export interface StatItem {
  name: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export interface AdminStatsGridProps {
  stats: StatItem[];
  columns?: {
    default: number;
    sm: number;
    lg: number;
  };
}

export function AdminStatsGrid({
  stats,
  columns = { default: 1, sm: 2, lg: 5 }
}: AdminStatsGridProps) {
  const gridClasses = `grid grid-cols-${columns.default} gap-5 sm:grid-cols-${columns.sm} lg:grid-cols-${columns.lg}`;

  return (
    <div className={gridClasses}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
