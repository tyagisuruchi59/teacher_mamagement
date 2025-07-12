"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { FilterOptions } from '@/types/teacher';
import { departments, subjects } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  RefreshCw, 
  Users, 
  BookOpen, 
  Building,
  CheckCircle,
  Clock,
  UserX,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface SearchAndFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
  className?: string;
}

const statusOptions = [
  { value: 'active', label: 'Active', icon: CheckCircle, color: 'text-green-600' },
  { value: 'inactive', label: 'Inactive', icon: UserX, color: 'text-gray-600' },
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
];

export function SearchAndFilter({ 
  filters, 
  onFiltersChange, 
  onReset, 
  className 
}: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Update select values to show "all" when filter is empty
  const displayFilters = {
    ...filters,
    department: filters.department || 'all',
    status: filters.status || 'all',
    subject: filters.subject || 'all'
  };

  // Debounced search to improve performance
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onFiltersChange({ ...filters, search: value });
    }, 300),
    [filters, onFiltersChange]
  );

  // Handle search input changes
  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue, debouncedSearch]);

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== null && value !== undefined
  ).length;

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof FilterOptions) => {
    onFiltersChange({ ...filters, [key]: '' });
  };

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <div className={cn(
          'relative transition-all duration-300 ease-out',
          isSearchFocused && 'transform scale-[1.02]'
        )}>
          <Search className={cn(
            'absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200',
            isSearchFocused ? 'text-primary' : 'text-gray-400'
          )} />
          <Input
            placeholder="Search teachers by name, email, or department..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={cn(
              'pl-10 pr-4 h-12 text-base transition-all duration-300',
              'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20',
              'hover:border-gray-300 hover:shadow-sm',
              isSearchFocused && 'shadow-lg border-primary'
            )}
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchValue('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Department Filter */}
          <Select
            value={filters.department}
            onValueChange={(value) => handleFilterChange('department', value)}
          >
            <SelectTrigger className={cn(
              'w-auto min-w-[140px] h-9 transition-all duration-200',
              filters.department && 'border-primary bg-primary/5'
            )}>
              <Building className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className={cn(
              'w-auto min-w-[120px] h-9 transition-all duration-200',
              filters.status && 'border-primary bg-primary/5'
            )}>
              <Users className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              {statusOptions.map((status) => {
                const Icon = status.icon;
                return (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <Icon className={cn('h-4 w-4', status.color)} />
                      {status.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Advanced Filters Popover */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-9 transition-all duration-200 relative',
                  (filters.subject || isFilterOpen) && 'border-primary bg-primary/5'
                )}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                More Filters
                {filters.subject && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                    1
                  </Badge>
                )}
                <ChevronDown className={cn(
                  'h-3 w-3 ml-1 transition-transform duration-200',
                  isFilterOpen && 'rotate-180'
                )} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Advanced Filters</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Subject</Label>
                    <Select
                      value={filters.subject}
                      onValueChange={(value) => handleFilterChange('subject', value)}
                    >
                      <SelectTrigger className="w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Subjects</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onReset();
                      setIsFilterOpen(false);
                    }}
                    className="text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Reset All
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                    className="text-xs"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {filters.search && (
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200"
            >
              Search: "{filters.search}"
              <X
                className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600 transition-colors duration-200"
                onClick={() => {
                  setSearchValue('');
                  clearFilter('search');
                }}
              />
            </Badge>
          )}
          
          {filters.department && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200"
            >
              Department: {filters.department}
              <X
                className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600 transition-colors duration-200"
                onClick={() => clearFilter('department')}
              />
            </Badge>
          )}
          
          {filters.status && (
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors duration-200"
            >
              Status: {statusOptions.find(s => s.value === filters.status)?.label}
              <X
                className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600 transition-colors duration-200"
                onClick={() => clearFilter('status')}
              />
            </Badge>
          )}
          
          {filters.subject && (
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors duration-200"
            >
              Subject: {filters.subject}
              <X
                className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600 transition-colors duration-200"
                onClick={() => clearFilter('subject')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}