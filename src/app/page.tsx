"use client";

import { useState, useMemo, useEffect } from 'react';
import { Teacher, TeacherFormData, FilterOptions } from '@/types/teacher';
import { mockTeachers } from '@/lib/mock-data';
import { StatsCard, StatsCardSkeleton } from '@/components/ui/stats-card';
import { TeacherCard, TeacherCardSkeleton } from '@/components/ui/teacher-card';
import { TeacherForm } from '@/components/ui/teacher-form';
//import { SearchAndFilter } from '@/components/ui/search-and-filter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Plus, 
  Grid, 
  List,
  TrendingUp,
  Award,
  BookOpen,
  Building,
  Download,
  Upload,
  Settings,
  Bell,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import swal from 'sweetalert';


export default function TeacherManagement() {
  // State management
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    department: '',
    status: '',
    subject: ''
  });

  // Initialize data with loading simulation
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API loading time
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTeachers(mockTeachers);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const active = teachers.filter(t => t.status === 'active').length;
    const inactive = teachers.filter(t => t.status === 'inactive').length;
    const pending = teachers.filter(t => t.status === 'pending').length;
    const totalExperience = teachers.reduce((sum, t) => sum + t.experience, 0);
    const avgExperience = teachers.length > 0 ? Math.round(totalExperience / teachers.length) : 0;
    
    // Calculate trends (simulated)
    const activeTrend = { value: 12, isPositive: true };
    const experienceTrend = { value: 8, isPositive: true };
    
    return {
      total: teachers.length,
      active,
      inactive,
      pending,
      avgExperience,
      activeTrend,
      experienceTrend
    };
  }, [teachers]);

  // Advanced filtering with search across multiple fields
  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      // Search across multiple fields
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = !searchTerm || (
        teacher.firstName.toLowerCase().includes(searchTerm) ||
        teacher.lastName.toLowerCase().includes(searchTerm) ||
        teacher.email.toLowerCase().includes(searchTerm) ||
        teacher.department.toLowerCase().includes(searchTerm) ||
        teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm)) ||
        teacher.qualification.toLowerCase().includes(searchTerm)
      );

      // Filter by department
      const matchesDepartment = !filters.department || teacher.department === filters.department;
      
      // Filter by status
      const matchesStatus = !filters.status || teacher.status === filters.status;
      
      // Filter by subject
      const matchesSubject = !filters.subject || teacher.subjects.includes(filters.subject);

      return matchesSearch && matchesDepartment && matchesStatus && matchesSubject;
    });
  }, [teachers, filters]);

  // Event handlers
  const handleAddTeacher = () => {
    setEditingTeacher(undefined);
    setShowForm(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setShowForm(true);
  };

const handleDeleteTeacher = (teacherId: string) => {
  const teacher = teachers.find(t => t.id === teacherId);
  if (!teacher) return;

  swal({
    title: 'Are you sure?',
    text: `Deleting ${teacher.firstName} ${teacher.lastName} cannot be undone.`,
    icon: 'warning',
    buttons: ['Cancel', 'Delete'],
    dangerMode: true,
  })
  .then(async (willDelete) => {
    if (!willDelete) return;

    setIsLoading(true);
    try {
      // simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      setTeachers(prev => prev.filter(t => t.id !== teacherId));
      toast.success('Teacher deleted successfully', {
        description: `${teacher.firstName} ${teacher.lastName} has been removed from the system.`
      });
    } catch (error) {
      toast.error('Failed to delete teacher', {
        description: 'Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  });
};



  const handleFormSubmit = async (formData: TeacherFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (editingTeacher) {
        // Update existing teacher
        const updatedTeacher: Teacher = {
          ...editingTeacher,
          ...formData,
          id: editingTeacher.id,
          status: editingTeacher.status,
          hireDate: editingTeacher.hireDate
        };
        
        setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? updatedTeacher : t));
        toast.success('Teacher updated successfully!', {
          description: `${formData.firstName} ${formData.lastName}'s information has been updated.`
        });
      } else {
        // Add new teacher
        const newTeacher: Teacher = {
          ...formData,
          id: Date.now().toString(),
          status: 'pending',
          hireDate: new Date().toISOString().split('T')[0]
        };
        
        setTeachers(prev => [...prev, newTeacher]);
        toast.success('Teacher added successfully!', {
          description: `${formData.firstName} ${formData.lastName} has been added to the system.`
        });
      }
      
      setShowForm(false);
      setEditingTeacher(undefined);
    } catch (error) {
      toast.error('Operation failed', {
        description: 'An error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTeacher(undefined);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: '',
      status: '',
      subject: ''
    });
    toast.info('Filters cleared');
  };

  // Show form view
  if (showForm) {
    return (
      <TeacherForm
        teacher={editingTeacher}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isLoading={isSubmitting}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title and Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Teacher Management
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your teaching staff efficiently with modern tools
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2 hover:bg-gray-50 transition-all duration-200"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2 hover:bg-gray-50 transition-all duration-200"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
              
              <Button
                onClick={handleAddTeacher}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl button-press cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Teacher
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Statistics Dashboard */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Overview Statistics
            </h2>
            <Badge variant="outline" className="text-xs">
              Last updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))
            ) : (
              <>
                <StatsCard
                  title="Total Teachers"
                  value={stats.total}
                  icon={Users}
                  description="All registered teachers"
                  variant="default"
                />
                <StatsCard
                  title="Active Teachers"
                  value={stats.active}
                  icon={UserCheck}
                  description="Currently teaching"
                  trend={stats.activeTrend}
                  variant="success"
                />
                <StatsCard
                  title="Pending Approval"
                  value={stats.pending}
                  icon={Clock}
                  description="Awaiting approval"
                  variant="warning"
                />
                <StatsCard
                  title="Avg. Experience"
                  value={`${stats.avgExperience} years`}
                  icon={Award}
                  description="Average teaching experience"
                  trend={stats.experienceTrend}
                  variant="primary"
                />
              </>
            )}
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Find Teachers
            </h2>
          </div>
          
          {/* <SearchAndFilter
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleResetFilters}
          /> */}
        </section>

        {/* Results Section */}
        <section className="space-y-6">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Teachers
              </h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? 's' : ''} found
              </Badge>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'h-8 px-3 transition-all duration-200',
                  viewMode === 'grid' && 'shadow-sm'
                )}
              >
                <Grid className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  'h-8 px-3 transition-all duration-200',
                  viewMode === 'list' && 'shadow-sm'
                )}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>

          {/* Teachers Display */}
          {isLoading ? (
            // Loading skeletons
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {Array.from({ length: 6 }).map((_, i) => (
                <TeacherCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredTeachers.length === 0 ? (
            // Empty state
            <div className="text-center py-16 animate-fade-in">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No teachers found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {Object.values(filters).some(filter => filter !== '')
                  ? "No teachers match your current search criteria. Try adjusting your filters or search terms."
                  : "Get started by adding your first teacher to the system."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleAddTeacher} className="button-press">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teacher
                </Button>
                {Object.values(filters).some(filter => filter !== '') && (
                  <Button variant="outline" onClick={handleResetFilters} className="button-press">
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            // Teachers grid/list
            <div className={cn(
              'animate-fade-in',
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            )}>
              {filteredTeachers.map((teacher, index) => (
                <div
                  key={teacher.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TeacherCard 
                    teacher={teacher}
                    onEdit={handleEditTeacher}
                    onDelete={handleDeleteTeacher}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © 2025 Teacher Management System. Built with Next.js, TypeScript, and Tailwind CSS.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}