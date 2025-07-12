import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Trend {
  value: number;
  isPositive: boolean;
}

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: Trend;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'bg-white border-gray-200 hover:border-gray-300',
  primary: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300',
  success: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300',
  warning: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-300',
  danger: 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:border-red-300',
};

const iconStyles = {
  default: 'text-gray-600',
  primary: 'text-blue-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  variant = 'default',
}: StatsCardProps) {
  return (
    <div
      className={cn(
        // Base styles
        'relative overflow-hidden rounded-xl border p-6 shadow-sm',
        'transition-all duration-300 ease-out',
        'hover:shadow-lg hover:-translate-y-1',
        'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
        // Variant styles
        variantStyles[variant],
        className
      )}
      role="article"
      aria-labelledby={`stats-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
      
      <div className="relative">
        {/* Header with icon and trend */}
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg',
            'bg-white/80 backdrop-blur-sm shadow-sm',
            'transition-transform duration-300 hover:scale-110'
          )}>
            <Icon className={cn('h-6 w-6', iconStyles[variant])} aria-hidden="true" />
          </div>
          
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                trend.isPositive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              )}
              aria-label={`Trend: ${trend.isPositive ? 'positive' : 'negative'} ${trend.value}%`}
            >
              <span className={cn(
                'text-xs',
                trend.isPositive ? '↗' : '↘'
              )}>
                {trend.isPositive ? '↗' : '↘'}
              </span>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3
            id={`stats-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-sm font-medium text-gray-600 tracking-wide uppercase"
          >
            {title}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 tabular-nums">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
          </div>
          
          {description && (
            <p className="text-sm text-gray-500 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Loading state overlay */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm opacity-0 transition-opacity duration-300 flex items-center justify-center">
        <div className="spinner h-6 w-6" />
      </div>
    </div>
  );
}

// Loading skeleton component
export function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border p-6 shadow-sm bg-white', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-12 rounded-lg loading-skeleton" />
        <div className="h-6 w-16 rounded-full loading-skeleton" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 loading-skeleton" />
        <div className="h-8 w-16 loading-skeleton" />
        <div className="h-4 w-32 loading-skeleton" />
      </div>
    </div>
  );
}