import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { Student, Subject } from '../../types/sms';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { StudentModal } from './StudentModal';
import { StudentDetailsModal } from './StudentDetailsModal';
import { apiService } from '../../services/api';
import { toast } from 'sonner@2.0.3';
import { generateStudentPDF } from '../../utils/pdfGenerator';

interface StudentListProps {
  students: Student[];
  subjects: Subject[];
  onStudentChange: () => void;
  onRefresh: () => void;
}

export function StudentList({ students, subjects, onStudentChange, onRefresh }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState<number | 'all'>('all');
  const [filterDepartment, setFilterDepartment] = useState<string | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Get unique departments
  const departments = Array.from(new Set(students.map(s => s.department)));

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = filterSemester === 'all' || student.semester === filterSemester;
    const matchesDepartment = filterDepartment === 'all' || student.department === filterDepartment;
    
    return matchesSearch && matchesSemester && matchesDepartment;
  });

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`Are you sure you want to delete ${student.name}?`)) {
      return;
    }

    try {
      await apiService.deleteStudent(student.id);
      toast.success('Student deleted successfully');
      onStudentChange();
    } catch (error) {
      toast.error('Failed to delete student');
      console.error(error);
    }
  };

  const handlePrintStudent = (student: Student) => {
    generateStudentPDF(student, subjects);
    toast.success('PDF generated successfully');
  };

  const calculateGPA = (student: Student) => {
    if (student.subjects.length === 0) return 'N/A';
    
    const totalMarks = student.subjects.reduce((sum, s) => sum + s.marks, 0);
    const average = totalMarks / student.subjects.length;
    
    // Convert to GPA scale (0-10)
    return (average / 10).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl text-gray-900">Students</h2>
        <Button onClick={handleAddStudent}>
          <Plus size={16} className="mr-2" />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search by name, roll number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Semester</label>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Department</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600">Roll Number</th>
                <th className="text-left py-3 px-4 text-gray-600">Name</th>
                <th className="text-left py-3 px-4 text-gray-600">Email</th>
                <th className="text-left py-3 px-4 text-gray-600">Department</th>
                <th className="text-left py-3 px-4 text-gray-600">Semester</th>
                <th className="text-left py-3 px-4 text-gray-600">GPA</th>
                <th className="text-right py-3 px-4 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{student.rollNumber}</td>
                  <td className="py-3 px-4 text-gray-900">{student.name}</td>
                  <td className="py-3 px-4 text-gray-600">{student.email}</td>
                  <td className="py-3 px-4 text-gray-600">{student.department}</td>
                  <td className="py-3 px-4 text-gray-600">{student.semester}</td>
                  <td className="py-3 px-4 text-gray-600">{calculateGPA(student)}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewStudent(student)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditStudent(student)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handlePrintStudent(student)}
                      >
                        <FileText size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteStudent(student)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <StudentModal
          student={selectedStudent}
          subjects={subjects}
          onClose={() => setIsModalOpen(false)}
          onSave={onStudentChange}
        />
      )}

      {isDetailsModalOpen && selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          subjects={subjects}
          onClose={() => setIsDetailsModalOpen(false)}
          onEdit={() => {
            setIsDetailsModalOpen(false);
            setIsModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
