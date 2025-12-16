import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Student, Subject } from '../types/sms';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-569d7c76`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export const apiService = {
  // Students
  async getStudents(): Promise<Student[]> {
    const response = await fetch(`${BASE_URL}/students`, { headers });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async getStudent(id: string): Promise<Student | null> {
    const response = await fetch(`${BASE_URL}/students/${id}`, { headers });
    const data = await response.json();
    return data.success ? data.data : null;
  },

  async createStudent(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> {
    const response = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers,
      body: JSON.stringify(student),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(student),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async deleteStudent(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
  },

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    const response = await fetch(`${BASE_URL}/subjects`, { headers });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async createSubject(subject: Omit<Subject, 'id' | 'createdAt'>): Promise<Subject> {
    const response = await fetch(`${BASE_URL}/subjects`, {
      method: 'POST',
      headers,
      body: JSON.stringify(subject),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async updateSubject(id: string, subject: Partial<Subject>): Promise<Subject> {
    const response = await fetch(`${BASE_URL}/subjects/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(subject),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async deleteSubject(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/subjects/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
  },

  // Bulk operations
  async importData(data: { students: Student[]; subjects: Subject[] }): Promise<void> {
    const response = await fetch(`${BASE_URL}/import`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
  },

  async exportData(): Promise<{ students: Student[]; subjects: Subject[] }> {
    const response = await fetch(`${BASE_URL}/export`, { headers });
    const data = await response.json();
    return data.success ? data.data : { students: [], subjects: [] };
  },

  async clearAll(): Promise<void> {
    const response = await fetch(`${BASE_URL}/clear-all`, {
      method: 'DELETE',
      headers,
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
  },

  async seedData(): Promise<void> {
    const response = await fetch(`${BASE_URL}/seed`, {
      method: 'POST',
      headers,
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
  },
};
