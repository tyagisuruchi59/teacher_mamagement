/**
 * TeacherForm Component
 * 
 * A comprehensive form for adding and editing teachers with advanced validation,
 * real-time feedback, and smooth animations. Features multi-step layout and
 * accessibility support.
 */

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Teacher, TeacherFormData } from '@/types/teacher';
import { departments, subjects } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  DollarSign,
  Award,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Validation schema with comprehensive rules
const teacherSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits'),
  subjects: z.array(z.string())
    .min(1, 'Please select at least one subject')
    .max(5, 'Maximum 5 subjects allowed'),
  department: z.string()
    .min(1, 'Please select a department'),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  experience: z.number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience cannot exceed 50 years'),
  qualification: z.string()
    .min(2, 'Qualification must be at least 2 characters')
    .max(100, 'Qualification must be less than 100 characters'),
  salary: z.number()
    .min(20000, 'Salary must be at least $20,000')
    .max(200000, 'Salary cannot exceed $200,000'),
  address: z.object({
    street: z.string()
      .min(5, 'Street address must be at least 5 characters')
      .max(100, 'Street address must be less than 100 characters'),
    city: z.string()
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City must be less than 50 characters'),
    state: z.string()
      .min(2, 'State must be at least 2 characters')
      .max(50, 'State must be less than 50 characters'),
    zipCode: z.string()
      .regex(/^\d{6}?$/, 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'),
  }),
});

interface TeacherFormProps {
  teacher?: Teacher;
  onSubmit: (data: TeacherFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TeacherForm({ teacher, onSubmit, onCancel, isLoading = false }: TeacherFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(teacher?.subjects || []);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const isEditing = !!teacher;
  const totalSteps = 3;

  // Form setup with validation
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
    trigger,
    reset
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: teacher ? {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      subjects: teacher.subjects,
      department: teacher.department,
      bio: teacher.bio || '',
      experience: teacher.experience,
      qualification: teacher.qualification,
      salary: teacher.salary,
      address: teacher.address,
    } : {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subjects: [],
      department: '',
      bio: '',
      experience: 0,
      qualification: '',
      salary: 50000,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
    mode: 'onChange'
  });

  // Watch form values for real-time validation
  const watchedValues = watch();

  // Handle subject selection
  const handleSubjectToggle = (subject: string) => {
    const newSubjects = selectedSubjects.includes(subject)
      ? selectedSubjects.filter(s => s !== subject)
      : [...selectedSubjects, subject];
    
    if (newSubjects.length <= 5) {
      setSelectedSubjects(newSubjects);
      setValue('subjects', newSubjects, { shouldValidate: true });
    } else {
      toast.error('Maximum 5 subjects allowed');
    }
  };

  // Step navigation
  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast.error('Please fix the errors before continuing');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Get fields to validate for each step
  const getFieldsForStep = (step: number): (keyof TeacherFormData)[] => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone'];
      case 2:
        return ['subjects', 'department', 'bio', 'experience', 'qualification'];
      case 3:
        return ['salary', 'address'];
      default:
        return [];
    }
  };

  // Form submission
  const onFormSubmit = async (data: TeacherFormData) => {
    try {
      await onSubmit(data);
      toast.success(isEditing ? 'Teacher updated successfully!' : 'Teacher added successfully!');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  // Reset form when teacher changes
  useEffect(() => {
    if (teacher) {
      reset({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        phone: teacher.phone,
        subjects: teacher.subjects,
        department: teacher.department,
        bio: teacher.bio || '',
        experience: teacher.experience,
        qualification: teacher.qualification,
        salary: teacher.salary,
        address: teacher.address,
      });
      setSelectedSubjects(teacher.subjects);
    }
  }, [teacher, reset]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teachers
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEditing ? 'Edit Teacher' : 'Add New Teacher'}
            </h1>
            <p className="text-gray-600">
              {isEditing 
                ? 'Update teacher information and save changes' 
                : 'Fill in the details to add a new teacher to your system'
              }
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                    step === currentStep
                      ? 'border-primary bg-primary text-white shadow-lg scale-110'
                      : step < currentStep
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                  )}
                >
                  {step < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step}</span>
                  )}
                </div>
                {step < totalSteps && (
                  <div
                    className={cn(
                      'h-1 w-16 mx-2 rounded-full transition-all duration-300',
                      step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <Card className="shadow-lg border-0 animate-scale-in">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                {getStepIcon(currentStep)}
                {getStepTitle(currentStep)}
              </CardTitle>
              <CardDescription>
                {getStepDescription(currentStep)}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        placeholder="Enter first name"
                        className={cn(
                          'transition-all duration-200',
                          errors.firstName && 'border-red-500 focus:border-red-500 form-field-error'
                        )}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        placeholder="Enter last name"
                        className={cn(
                          'transition-all duration-200',
                          errors.lastName && 'border-red-500 focus:border-red-500 form-field-error'
                        )}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="Enter email address"
                      className={cn(
                        'transition-all duration-200',
                        errors.email && 'border-red-500 focus:border-red-500 form-field-error'
                      )}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="Enter phone number"
                      className={cn(
                        'transition-all duration-200',
                        errors.phone && 'border-red-500 focus:border-red-500 form-field-error'
                      )}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Professional Information */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Subjects * (Select up to 5)
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg bg-gray-50">
                      {subjects.map((subject) => (
                        <div key={subject} className="flex items-center space-x-2">
                          <Checkbox
                            id={subject}
                            checked={selectedSubjects.includes(subject)}
                            onCheckedChange={() => handleSubjectToggle(subject)}
                            className="transition-all duration-200"
                          />
                          <Label
                            htmlFor={subject}
                            className="text-sm cursor-pointer hover:text-primary transition-colors duration-200"
                          >
                            {subject}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {selectedSubjects.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSubjects.map((subject) => (
                          <Badge
                            key={subject}
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200"
                          >
                            {subject}
                            <X
                              className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600"
                              onClick={() => handleSubjectToggle(subject)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                    {errors.subjects && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.subjects.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-medium">
                        Department *
                      </Label>
                      <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={cn(
                              'transition-all duration-200',
                              errors.department && 'border-red-500 form-field-error'
                            )}>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.department && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.department.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-sm font-medium">
                        Years of Experience *
                      </Label>
                      <Input
                        id="experience"
                        type="number"
                        min="0"
                        max="50"
                        {...register('experience', { valueAsNumber: true })}
                        placeholder="Enter years of experience"
                        className={cn(
                          'transition-all duration-200',
                          errors.experience && 'border-red-500 focus:border-red-500 form-field-error'
                        )}
                      />
                      {errors.experience && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.experience.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualification" className="text-sm font-medium">
                      Qualification *
                    </Label>
                    <Input
                      id="qualification"
                      {...register('qualification')}
                      placeholder="Enter highest qualification"
                      className={cn(
                        'transition-all duration-200',
                        errors.qualification && 'border-red-500 focus:border-red-500 form-field-error'
                      )}
                    />
                    {errors.qualification && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.qualification.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                      Bio (Optional)
                    </Label>
                    <Textarea
                      id="bio"
                      {...register('bio')}
                      placeholder="Enter a brief bio about the teacher"
                      rows={4}
                      className={cn(
                        'transition-all duration-200 resize-none',
                        errors.bio && 'border-red-500 focus:border-red-500 form-field-error'
                      )}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{errors.bio?.message}</span>
                      <span>{watchedValues.bio?.length || 0}/500</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Salary and Address */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-sm font-medium">
                      Annual Salary *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="salary"
                        type="number"
                        min="20000"
                        max="200000"
                        step="1000"
                        {...register('salary', { valueAsNumber: true })}
                        placeholder="Enter annual salary"
                        className={cn(
                          'pl-10 transition-all duration-200',
                          errors.salary && 'border-red-500 focus:border-red-500 form-field-error'
                        )}
                      />
                    </div>
                    {errors.salary && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.salary.message}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Address Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="street" className="text-sm font-medium">
                        Street Address *
                      </Label>
                      <Input
                        id="street"
                        {...register('address.street')}
                        placeholder="Enter street address"
                        className={cn(
                          'transition-all duration-200',
                          errors.address?.street && 'border-red-500 focus:border-red-500 form-field-error'
                        )}
                      />
                      {errors.address?.street && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.address.street.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">
                          City *
                        </Label>
                        <Input
                          id="city"
                          {...register('address.city')}
                          placeholder="Enter city"
                          className={cn(
                            'transition-all duration-200',
                            errors.address?.city && 'border-red-500 focus:border-red-500 form-field-error'
                          )}
                        />
                        {errors.address?.city && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.address.city.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium">
                          State *
                        </Label>
                        <Input
                          id="state"
                          {...register('address.state')}
                          placeholder="Enter state"
                          className={cn(
                            'transition-all duration-200',
                            errors.address?.state && 'border-red-500 focus:border-red-500 form-field-error'
                          )}
                        />
                        {errors.address?.state && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.address.state.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode" className="text-sm font-medium">
                          ZIP Code *
                        </Label>
                        <Input
                          id="zipCode"
                          {...register('address.zipCode')}
                          placeholder="Enter ZIP code"
                          className={cn(
                            'transition-all duration-200',
                            errors.address?.zipCode && 'border-red-500 focus:border-red-500 form-field-error'
                          )}
                        />
                        {errors.address?.zipCode && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.address.zipCode.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 animate-fade-in">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="button-press hover:bg-gray-50 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="button-press hover:bg-red-50 hover:text-red-700 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>

            <div className="flex gap-3">
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="button-press bg-primary hover:bg-primary/90 transition-all duration-200"
                >
                  Next Step
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !isValid}
                  className="button-press bg-green-600 hover:bg-green-700 transition-all duration-200 min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? 'Update Teacher' : 'Add Teacher'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper functions
function getStepTitle(step: number): string {
  switch (step) {
    case 1:
      return 'Personal Information';
    case 2:
      return 'Professional Details';
    case 3:
      return 'Salary & Address';
    default:
      return '';
  }
}

function getStepDescription(step: number): string {
  switch (step) {
    case 1:
      return 'Enter the teacher\'s basic personal information and contact details.';
    case 2:
      return 'Specify the subjects, department, qualifications, and professional background.';
    case 3:
      return 'Set the salary information and complete address details.';
    default:
      return '';
  }
}

function getStepIcon(step: number) {
  switch (step) {
    case 1:
      return <User className="h-5 w-5" />;
    case 2:
      return <BookOpen className="h-5 w-5" />;
    case 3:
      return <MapPin className="h-5 w-5" />;
    default:
      return null;
  }
}