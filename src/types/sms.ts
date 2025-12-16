export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  createdAt?: string;
}

export interface StudentSubject {
  subjectId: string;
  marks: number;
  grade?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  semester: number;
  year: number;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  guardianName?: string;
  guardianPhone?: string;
  subjects: StudentSubject[];
  createdAt?: string;
  updatedAt?: string;
}
