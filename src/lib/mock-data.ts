import { Teacher } from '@/types/teacher';

export const mockTeachers: Teacher[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+1 (555) 123-4567',
    subjects: ['Mathematics', 'Physics'],
    status: 'active',
    hireDate: '2020-09-15',
    department: 'STEM',
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Passionate educator with 8 years of experience in mathematics and physics.',
    experience: 8,
    qualification: 'Master\'s in Mathematics',
    salary: 65000,
    address: {
      street: '123 Maple Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    }
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@school.edu',
    phone: '+1 (555) 234-5678',
    subjects: ['Chemistry', 'Biology'],
    status: 'active',
    hireDate: '2019-08-22',
    department: 'Science',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Dedicated science teacher focused on hands-on learning and student engagement.',
    experience: 10,
    qualification: 'PhD in Chemistry',
    salary: 72000,
    address: {
      street: '456 Oak Avenue',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702'
    }
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@school.edu',
    phone: '+1 (555) 345-6789',
    subjects: ['English Literature', 'Creative Writing'],
    status: 'active',
    hireDate: '2021-01-10',
    department: 'English',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Creative writing enthusiast helping students find their voice through literature.',
    experience: 6,
    qualification: 'Master\'s in English Literature',
    salary: 58000,
    address: {
      street: '789 Pine Road',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62703'
    }
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Rodriguez',
    email: 'david.rodriguez@school.edu',
    phone: '+1 (555) 456-7890',
    subjects: ['History', 'Social Studies'],
    status: 'pending',
    hireDate: '2024-01-15',
    department: 'Social Studies',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'History professor with expertise in modern American history and civic education.',
    experience: 12,
    qualification: 'PhD in History',
    salary: 68000,
    address: {
      street: '321 Elm Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704'
    }
  },
  {
    id: '5',
    firstName: 'Lisa',
    lastName: 'Thompson',
    email: 'lisa.thompson@school.edu',
    phone: '+1 (555) 567-8901',
    subjects: ['Art', 'Design'],
    status: 'inactive',
    hireDate: '2018-03-20',
    department: 'Arts',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Visual arts teacher inspiring creativity and artistic expression in students.',
    experience: 14,
    qualification: 'Master\'s in Fine Arts',
    salary: 55000,
    address: {
      street: '654 Birch Lane',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62705'
    }
  },
  {
    id: '6',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'robert.wilson@school.edu',
    phone: '+1 (555) 678-9012',
    subjects: ['Physical Education', 'Health'],
    status: 'active',
    hireDate: '2017-08-30',
    department: 'Physical Education',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Athletic coordinator promoting physical fitness and healthy lifestyle habits.',
    experience: 9,
    qualification: 'Bachelor\'s in Kinesiology',
    salary: 52000,
    address: {
      street: '987 Cedar Court',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62706'
    }
  }
];

export const departments = [
  'STEM',
  'Science',
  'English',
  'Social Studies',
  'Arts',
  'Physical Education',
  'Music',
  'Foreign Languages'
];

export const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Literature',
  'Creative Writing',
  'History',
  'Social Studies',
  'Art',
  'Design',
  'Physical Education',
  'Health',
  'Music',
  'Spanish',
  'French',
  'Computer Science'
];