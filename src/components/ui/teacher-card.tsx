import React, { useState } from 'react';
import { Teacher } from '@/types/teacher';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Edit, 
  Trash2, 
  MoreVertical,
  User,
  DollarSign,
  Award,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeacherCardProps {
  teacher: Teacher;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacherId: string) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 border-green-200',
    dotColor: 'bg-green-500',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    dotColor: 'bg-gray-500',
  },
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dotColor: 'bg-yellow-500',
  },
};

export function TeacherCard({ 
  teacher, 
  onEdit, 
  onDelete, 
  className,
  variant = 'default' 
}: TeacherCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const status = statusConfig[teacher.status];
  const fullName = `${teacher.firstName} ${teacher.lastName}`;
  const initials = `${teacher.firstName[0]}${teacher.lastName[0]}`;

  const handleEdit = () => {
    setIsLoading(true);
    setTimeout(() => {
      onEdit(teacher);
      setIsLoading(false);
    }, 300);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${fullName}?`)) {
      setIsLoading(true);
      setTimeout(() => {
        onDelete(teacher.id);
        setIsLoading(false);
      }, 300);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn(
        'flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200',
        'hover:shadow-md hover:border-gray-300 transition-all duration-300',
        className
      )}>
        <Avatar className="h-12 w-12 ring-2 ring-gray-100">
          <AvatarImage 
            src={!imageError ? teacher.avatar : undefined} 
            alt={fullName}
            onError={() => setImageError(true)}
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{fullName}</h3>
          <p className="text-sm text-gray-500 truncate">{teacher.email}</p>
        </div>
        
        <Badge variant="outline" className={status.className}>
          <div className={cn('w-2 h-2 rounded-full mr-2', status.dotColor)} />
          {status.label}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className='bg-white'>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm',
        'transition-all duration-300 ease-out',
        'hover:shadow-xl hover:-translate-y-1 hover:border-gray-300',
        'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
        isLoading && 'opacity-50 pointer-events-none',
        className
      )}
      role="article"
      aria-labelledby={`teacher-${teacher.id}-name`}
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 opacity-50 transition-transform duration-500 group-hover:scale-110" />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="spinner h-6 w-6" />
        </div>
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <AvatarImage 
                src={!imageError ? teacher.avatar : undefined} 
                alt={fullName}
                onError={() => setImageError(true)}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <h3 
                id={`teacher-${teacher.id}-name`}
                className="text-xl font-bold text-gray-900 leading-tight"
              >
                {fullName}
              </h3>
              <p className="text-sm font-medium text-gray-600">
                {teacher.department}
              </p>
              <Badge variant="outline" className={cn('text-xs', status.className)}>
                <div className={cn('w-2 h-2 rounded-full mr-2 animate-pulse', status.dotColor)} />
                {status.label}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu for {fullName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white">
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Edit Teacher
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete} 
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Teacher
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bio */}
        {teacher.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {teacher.bio}
          </p>
        )}

        {/* Subjects */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {teacher.subjects.slice(0, 3).map((subject) => (
              <Badge 
                key={subject} 
                variant="secondary" 
                className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors duration-200"
              >
                <BookOpen className="h-3 w-3 mr-1" />
                {subject}
              </Badge>
            ))}
            {teacher.subjects.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{teacher.subjects.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Experience</p>
              <p className="text-sm font-semibold text-gray-900">{teacher.experience} years</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Salary</p>
              <p className="text-sm font-semibold text-gray-900">${teacher.salary.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <a 
              href={`mailto:${teacher.email}`} 
              className="truncate hover:underline"
              aria-label={`Email ${fullName}`}
            >
              {teacher.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <a 
              href={`tel:${teacher.phone}`} 
              className="hover:underline"
              aria-label={`Call ${fullName}`}
            >
              {teacher.phone}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>Hired {new Date(teacher.hireDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Button 
            onClick={handleEdit}
            variant="outline" 
            size="sm" 
            className="flex-1 button-press hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
            disabled={isLoading}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            onClick={handleDelete}
            variant="outline" 
            size="sm" 
            className="flex-1 button-press hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component
export function TeacherCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border p-6 shadow-sm bg-white', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full loading-skeleton" />
          <div className="space-y-2">
            <div className="h-6 w-32 loading-skeleton" />
            <div className="h-4 w-24 loading-skeleton" />
            <div className="h-5 w-16 loading-skeleton rounded-full" />
          </div>
        </div>
      </div>
      <div className="h-4 w-full loading-skeleton mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-20 loading-skeleton rounded-full" />
        <div className="h-6 w-24 loading-skeleton rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full loading-skeleton" />
        <div className="h-4 w-3/4 loading-skeleton" />
        <div className="h-4 w-1/2 loading-skeleton" />
      </div>
      <div className="flex gap-2 pt-4 border-t">
        <div className="h-8 flex-1 loading-skeleton rounded" />
        <div className="h-8 flex-1 loading-skeleton rounded" />
      </div>
    </div>
  );
}