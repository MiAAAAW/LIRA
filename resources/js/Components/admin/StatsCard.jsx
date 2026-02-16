import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/Components/ui/card';
import DynamicIcon from '@/Components/DynamicIcon';

const colorVariants = {
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
  yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400',
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
  pink: 'bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400',
  gray: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  teal: 'bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400',
  sky: 'bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
};

const iconBgVariants = {
  emerald: 'bg-emerald-100 dark:bg-emerald-900',
  blue: 'bg-blue-100 dark:bg-blue-900',
  cyan: 'bg-cyan-100 dark:bg-cyan-900',
  amber: 'bg-amber-100 dark:bg-amber-900',
  violet: 'bg-violet-100 dark:bg-violet-900',
  red: 'bg-red-100 dark:bg-red-900',
  orange: 'bg-orange-100 dark:bg-orange-900',
  yellow: 'bg-yellow-100 dark:bg-yellow-900',
  indigo: 'bg-indigo-100 dark:bg-indigo-900',
  pink: 'bg-pink-100 dark:bg-pink-900',
  gray: 'bg-gray-100 dark:bg-gray-700',
  teal: 'bg-teal-100 dark:bg-teal-900',
  sky: 'bg-sky-100 dark:bg-sky-900',
  rose: 'bg-rose-100 dark:bg-rose-900',
};

export default function StatsCard({
  label,
  count = 0,
  published = 0,
  icon = 'FileText',
  color = 'gray',
  route,
  className,
}) {
  const CardWrapper = route ? Link : 'div';
  const wrapperProps = route ? { href: route } : {};

  return (
    <CardWrapper {...wrapperProps} className={cn("block", className)}>
      <Card className={cn(
        "transition-all hover:shadow-md",
        route && "cursor-pointer hover:border-primary/50"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              iconBgVariants[color] || iconBgVariants.gray
            )}>
              <DynamicIcon
                name={icon}
                className={cn(
                  "h-6 w-6",
                  colorVariants[color] || colorVariants.gray
                )}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {label}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {count}
                </p>
                {published > 0 && (
                  <span className="text-sm text-green-600 dark:text-green-400">
                    ({published} publicados)
                  </span>
                )}
              </div>
            </div>

            {/* Arrow */}
            {route && (
              <DynamicIcon
                name="ChevronRight"
                className="h-5 w-5 text-gray-400"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}

export function StatsCardGrid({ stats, className }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5", className)}>
      {stats.map((stat) => (
        <StatsCard key={stat.id} {...stat} />
      ))}
    </div>
  );
}

export function StatsSummary({ total, published, className }) {
  return (
    <div className={cn("flex gap-6", className)}>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Total: <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-green-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Publicados: <span className="font-semibold text-green-600 dark:text-green-400">{published}</span>
        </span>
      </div>
    </div>
  );
}
