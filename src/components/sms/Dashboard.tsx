import { Users, BookOpen, Award, TrendingUp, FileDown, FileUp, Trash2, RefreshCw } from 'lucide-react';
import { Student, Subject } from '../../types/sms';
import { apiService } from '../../services/api';
import { toast } from 'sonner@2.0.3';
import { Button } from '../ui/button';

interface DashboardProps {
  students: Student[];
  subjects: Subject[];
  onRefresh: () => void;
}

export function Dashboard({ students, subjects, onRefresh }: DashboardProps) {
  const totalStudents = students.length;
  const totalSubjects = subjects.length;
  
  // Calculate average marks
  const averageMarks = students.reduce((acc, student) => {
    const totalMarks = student.subjects.reduce((sum, s) => sum + s.marks, 0);
    return acc + (student.subjects.length > 0 ? totalMarks / student.subjects.length : 0);
  }, 0) / (students.length || 1);

  // Count passed students (>= 40 in all subjects)
  const passedStudents = students.filter(student => 
    student.subjects.every(s => s.marks >= 40)
  ).length;

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Subjects', value: totalSubjects, icon: BookOpen, color: 'bg-green-500' },
    { label: 'Average Marks', value: averageMarks.toFixed(1), icon: Award, color: 'bg-yellow-500' },
    { label: 'Passed Students', value: passedStudents, icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const handleExportJSON = async () => {
    try {
      const data = await apiService.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
      console.error(error);
    }
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await apiService.importData(data);
        toast.success('Data imported successfully');
        onRefresh();
      } catch (error) {
        toast.error('Failed to import data. Please check the file format.');
        console.error(error);
      }
    };
    input.click();
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.clearAll();
      toast.success('All data cleared successfully');
      onRefresh();
    } catch (error) {
      toast.error('Failed to clear data');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl text-gray-900">Dashboard</h2>
        <div className="flex space-x-2">
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button onClick={handleImportJSON} variant="outline" size="sm">
            <FileUp size={16} className="mr-2" />
            Import JSON
          </Button>
          <Button onClick={handleExportJSON} variant="outline" size="sm">
            <FileDown size={16} className="mr-2" />
            Export JSON
          </Button>
          <Button onClick={handleClearAll} variant="destructive" size="sm">
            <Trash2 size={16} className="mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Students */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl text-gray-900 mb-4">Recent Students</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600">Roll Number</th>
                <th className="text-left py-3 px-4 text-gray-600">Name</th>
                <th className="text-left py-3 px-4 text-gray-600">Department</th>
                <th className="text-left py-3 px-4 text-gray-600">Semester</th>
                <th className="text-left py-3 px-4 text-gray-600">Subjects Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 5).map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{student.rollNumber}</td>
                  <td className="py-3 px-4 text-gray-900">{student.name}</td>
                  <td className="py-3 px-4 text-gray-600">{student.department}</td>
                  <td className="py-3 px-4 text-gray-600">{student.semester}</td>
                  <td className="py-3 px-4 text-gray-600">{student.subjects.length}</td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No students added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl text-gray-900 mb-4">Subject Distribution by Semester</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
            const semSubjects = subjects.filter(s => s.semester === sem);
            return (
              <div key={sem} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Semester {sem}</p>
                <p className="text-2xl text-gray-900 mt-1">{semSubjects.length}</p>
                <p className="text-xs text-gray-500 mt-1">subjects</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
