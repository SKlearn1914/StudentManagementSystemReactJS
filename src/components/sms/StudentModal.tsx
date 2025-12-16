import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Student, Subject, StudentSubject } from '../../types/sms';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { apiService } from '../../services/api';
import { toast } from 'sonner@2.0.3';

interface StudentModalProps {
  student: Student | null;
  subjects: Subject[];
  onClose: () => void;
  onSave: () => void;
}

export function StudentModal({ student, subjects, onClose, onSave }: StudentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    department: '',
    semester: 1,
    year: new Date().getFullYear(),
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
  });

  const [studentSubjects, setStudentSubjects] = useState<StudentSubject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        department: student.department,
        semester: student.semester,
        year: student.year,
        phoneNumber: student.phoneNumber || '',
        dateOfBirth: student.dateOfBirth || '',
        address: student.address || '',
        guardianName: student.guardianName || '',
        guardianPhone: student.guardianPhone || '',
      });
      setStudentSubjects(student.subjects || []);
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' || name === 'year' ? Number(value) : value,
    }));
  };

  const handleAddSubject = () => {
    const availableSubjects = subjects.filter(
      s => s.semester === formData.semester && !studentSubjects.find(ss => ss.subjectId === s.id)
    );

    if (availableSubjects.length === 0) {
      toast.error('No more subjects available for this semester');
      return;
    }

    setStudentSubjects(prev => [
      ...prev,
      { subjectId: availableSubjects[0].id, marks: 0 },
    ]);
  };

  const handleRemoveSubject = (index: number) => {
    setStudentSubjects(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubjectChange = (index: number, field: 'subjectId' | 'marks', value: string | number) => {
    setStudentSubjects(prev => prev.map((s, i) => 
      i === index ? { ...s, [field]: field === 'marks' ? Number(value) : value } : s
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const studentData = {
        ...formData,
        subjects: studentSubjects,
      };

      if (student) {
        await apiService.updateStudent(student.id, studentData);
        toast.success('Student updated successfully');
      } else {
        await apiService.createStudent(studentData);
        toast.success('Student created successfully');
      }

      onSave();
      onClose();
    } catch (error) {
      toast.error(student ? 'Failed to update student' : 'Failed to create student');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown';
  };

  const availableSubjectsForSemester = subjects.filter(s => s.semester === formData.semester);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl text-gray-900">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Full Name *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Roll Number *</label>
                <Input
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                  placeholder="CS2023001"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="student@university.edu"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Date of Birth</label>
                <Input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Department *</label>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Semester *</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Year *</label>
                <Input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="2000"
                  max="2100"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Street address, City, State, ZIP"
            />
          </div>

          {/* Guardian Information */}
          <div>
            <h3 className="text-lg text-gray-900 mb-4">Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Guardian Name</label>
                <Input
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  placeholder="Parent/Guardian Name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Guardian Phone</label>
                <Input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>

          {/* Subjects and Marks */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-gray-900">Subjects & Marks</h3>
              <Button type="button" onClick={handleAddSubject} size="sm">
                <Plus size={16} className="mr-2" />
                Add Subject
              </Button>
            </div>
            
            {studentSubjects.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No subjects added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentSubjects.map((studentSubject, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <select
                        value={studentSubject.subjectId}
                        onChange={(e) => handleSubjectChange(index, 'subjectId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {availableSubjectsForSemester.map(subject => (
                          <option key={subject.id} value={subject.id}>
                            {subject.code} - {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        value={studentSubject.marks}
                        onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)}
                        min="0"
                        max="100"
                        placeholder="Marks"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSubject(index)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : student ? 'Update Student' : 'Create Student'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
