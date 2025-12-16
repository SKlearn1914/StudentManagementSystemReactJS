import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Subject } from '../../types/sms';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { apiService } from '../../services/api';
import { toast } from 'sonner@2.0.3';

interface SubjectManagementProps {
  subjects: Subject[];
  onSubjectChange: () => void;
}

export function SubjectManagement({ subjects, onSubjectChange }: SubjectManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    semester: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (subject?: Subject) => {
    if (subject) {
      setSelectedSubject(subject);
      setFormData({
        name: subject.name,
        code: subject.code,
        credits: subject.credits,
        semester: subject.semester,
      });
    } else {
      setSelectedSubject(null);
      setFormData({ name: '', code: '', credits: 3, semester: 1 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubject(null);
    setFormData({ name: '', code: '', credits: 3, semester: 1 });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' || name === 'semester' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedSubject) {
        await apiService.updateSubject(selectedSubject.id, formData);
        toast.success('Subject updated successfully');
      } else {
        await apiService.createSubject(formData);
        toast.success('Subject created successfully');
      }

      onSubjectChange();
      handleCloseModal();
    } catch (error) {
      toast.error(selectedSubject ? 'Failed to update subject' : 'Failed to create subject');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subject: Subject) => {
    if (!confirm(`Are you sure you want to delete ${subject.name}?`)) {
      return;
    }

    try {
      await apiService.deleteSubject(subject.id);
      toast.success('Subject deleted successfully');
      onSubjectChange();
    } catch (error) {
      toast.error('Failed to delete subject');
      console.error(error);
    }
  };

  // Group subjects by semester
  const subjectsBySemester = subjects.reduce((acc, subject) => {
    if (!acc[subject.semester]) {
      acc[subject.semester] = [];
    }
    acc[subject.semester].push(subject);
    return acc;
  }, {} as Record<number, Subject[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl text-gray-900">Subject Management</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={16} className="mr-2" />
          Add Subject
        </Button>
      </div>

      {/* Subjects by Semester */}
      {[1, 2, 3, 4, 5, 6, 7, 8].map(semester => {
        const semesterSubjects = subjectsBySemester[semester] || [];
        
        return (
          <div key={semester} className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl text-gray-900 mb-4">
              Semester {semester} ({semesterSubjects.length} subjects)
            </h3>
            
            {semesterSubjects.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No subjects added for this semester</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-600">Code</th>
                      <th className="text-left py-3 px-4 text-gray-600">Subject Name</th>
                      <th className="text-center py-3 px-4 text-gray-600">Credits</th>
                      <th className="text-right py-3 px-4 text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesterSubjects.map((subject) => (
                      <tr key={subject.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{subject.code}</td>
                        <td className="py-3 px-4 text-gray-900">{subject.name}</td>
                        <td className="py-3 px-4 text-center text-gray-600">{subject.credits}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleOpenModal(subject)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(subject)}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {/* Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="border-b px-6 py-4">
              <h3 className="text-xl text-gray-900">
                {selectedSubject ? 'Edit Subject' : 'Add New Subject'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Subject Name *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Object Oriented Programming"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Subject Code *</label>
                <Input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="CS301"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Credits *</label>
                <Input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleChange}
                  required
                  min="1"
                  max="6"
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

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : selectedSubject ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
