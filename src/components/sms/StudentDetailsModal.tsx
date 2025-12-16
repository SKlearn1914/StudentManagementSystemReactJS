import { X, Edit, FileText, Mail, Phone, MapPin, User, Calendar } from 'lucide-react';
import { Student, Subject } from '../../types/sms';
import { Button } from '../ui/button';
import { generateStudentPDF } from '../../utils/pdfGenerator';
import { toast } from 'sonner@2.0.3';

interface StudentDetailsModalProps {
  student: Student;
  subjects: Subject[];
  onClose: () => void;
  onEdit: () => void;
}

export function StudentDetailsModal({ student, subjects, onClose, onEdit }: StudentDetailsModalProps) {
  const getSubject = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId);
  };

  const calculateGrade = (marks: number) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C+';
    if (marks >= 40) return 'C';
    return 'F';
  };

  const calculateGPA = () => {
    if (student.subjects.length === 0) return 'N/A';
    const totalMarks = student.subjects.reduce((sum, s) => sum + s.marks, 0);
    const average = totalMarks / student.subjects.length;
    return (average / 10).toFixed(2);
  };

  const totalCredits = student.subjects.reduce((sum, s) => {
    const subject = getSubject(s.subjectId);
    return sum + (subject?.credits || 0);
  }, 0);

  const handlePrintPDF = () => {
    generateStudentPDF(student, subjects);
    toast.success('PDF generated successfully');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl text-gray-900">Student Details</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={onEdit} size="sm">
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
            <Button onClick={handlePrintPDF} size="sm" variant="outline">
              <FileText size={16} className="mr-2" />
              Print PDF
            </Button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 ml-2">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-3xl mb-2">{student.name}</h3>
                <p className="text-blue-100">Roll Number: {student.rollNumber}</p>
                <p className="text-blue-100">{student.department} - Semester {student.semester}</p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm text-blue-100">GPA</p>
                  <p className="text-3xl">{calculateGPA()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg text-gray-900 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <Mail className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">{student.email}</p>
                </div>
              </div>
              {student.phoneNumber && (
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Phone className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-900">{student.phoneNumber}</p>
                  </div>
                </div>
              )}
              {student.dateOfBirth && (
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Calendar className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="text-gray-900">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              {student.address && (
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <MapPin className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-gray-900">{student.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Guardian Information */}
          {(student.guardianName || student.guardianPhone) && (
            <div>
              <h4 className="text-lg text-gray-900 mb-4">Guardian Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.guardianName && (
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                    <User className="text-blue-600" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Guardian Name</p>
                      <p className="text-gray-900">{student.guardianName}</p>
                    </div>
                  </div>
                )}
                {student.guardianPhone && (
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                    <Phone className="text-blue-600" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Guardian Phone</p>
                      <p className="text-gray-900">{student.guardianPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Academic Performance */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg text-gray-900">Academic Performance</h4>
              <div className="text-sm text-gray-600">Total Credits: {totalCredits}</div>
            </div>
            
            {student.subjects.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No subjects enrolled</p>
              </div>
            ) : (
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-600">Subject Code</th>
                      <th className="text-left py-3 px-4 text-gray-600">Subject Name</th>
                      <th className="text-center py-3 px-4 text-gray-600">Credits</th>
                      <th className="text-center py-3 px-4 text-gray-600">Marks</th>
                      <th className="text-center py-3 px-4 text-gray-600">Grade</th>
                      <th className="text-center py-3 px-4 text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.subjects.map((studentSubject) => {
                      const subject = getSubject(studentSubject.subjectId);
                      const grade = calculateGrade(studentSubject.marks);
                      const isPassed = studentSubject.marks >= 40;
                      
                      return (
                        <tr key={studentSubject.subjectId} className="border-b">
                          <td className="py-3 px-4 text-gray-900">{subject?.code || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-900">{subject?.name || 'Unknown Subject'}</td>
                          <td className="py-3 px-4 text-center text-gray-600">{subject?.credits || 0}</td>
                          <td className="py-3 px-4 text-center text-gray-900">{studentSubject.marks}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded text-sm ${
                              grade === 'F' ? 'bg-red-100 text-red-700' :
                              grade.includes('A') ? 'bg-green-100 text-green-700' :
                              grade.includes('B') ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {grade}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded text-sm ${
                              isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {isPassed ? 'Pass' : 'Fail'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="py-3 px-4 text-right text-gray-900">
                        Average:
                      </td>
                      <td className="py-3 px-4 text-center text-gray-900">
                        {student.subjects.length > 0
                          ? (student.subjects.reduce((sum, s) => sum + s.marks, 0) / student.subjects.length).toFixed(2)
                          : 'N/A'}
                      </td>
                      <td colSpan={2} className="py-3 px-4 text-center text-gray-900">
                        GPA: {calculateGPA()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
