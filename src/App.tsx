import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { Dashboard } from './components/sms/Dashboard';
import { StudentList } from './components/sms/StudentList';
import { SubjectManagement } from './components/sms/SubjectManagement';
import { Navigation } from './components/sms/Navigation';
import { Student, Subject } from './types/sms';
import { apiService } from './services/api';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'subjects'>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, subjectsData] = await Promise.all([
        apiService.getStudents(),
        apiService.getSubjects(),
      ]);
      
      setStudents(studentsData);
      setSubjects(subjectsData);
      
      // Seed default subjects if none exist
      if (subjectsData.length === 0) {
        await apiService.seedData();
        const newSubjects = await apiService.getSubjects();
        setSubjects(newSubjects);
        toast.success('Default subjects loaded successfully');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = () => {
    loadData();
  };

  const handleSubjectChange = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Student Management System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard students={students} subjects={subjects} onRefresh={loadData} />
        )}
        
        {activeTab === 'students' && (
          <StudentList 
            students={students} 
            subjects={subjects}
            onStudentChange={handleStudentChange}
            onRefresh={loadData}
          />
        )}
        
        {activeTab === 'subjects' && (
          <SubjectManagement 
            subjects={subjects}
            onSubjectChange={handleSubjectChange}
          />
        )}
      </main>
    </div>
  );
}
