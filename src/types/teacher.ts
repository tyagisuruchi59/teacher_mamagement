export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subjects: string[];
  status: 'active' | 'inactive' | 'pending';
  hireDate: string;
  department: string;
  avatar?: string;
  bio?: string;
  experience: number;
  qualification: string;
  salary: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subjects: string[];
  department: string;
  bio?: string;
  experience: number;
  qualification: string;
  salary: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface TeacherStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

export interface FilterOptions {
  search: string;
  department: string;
  status: string;
  subject: string;
}