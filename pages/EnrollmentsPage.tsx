
import React, { useState } from 'react';
import { Enrollment, Student, Course } from '../types';
import EnrollmentCard from '../components/EnrollmentCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { DocumentPlusIcon } from '@heroicons/react/24/outline'; // Changed Icon
import Input from '../components/Input';

interface EnrollmentsPageProps {
  enrollments: Enrollment[];
  students: Student[];
  courses: Course[];
  addEnrollment: (enrollment: Omit<Enrollment, 'id'>) => boolean; // Returns true on success
  deleteEnrollment: (enrollmentId: string) => void;
  headingTextColor?: string;
}

const EnrollmentsPage: React.FC<EnrollmentsPageProps> = ({ enrollments, students, courses, addEnrollment, deleteEnrollment, headingTextColor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
  });
  const [searchTerm, setSearchTerm] = useState('');


  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.courseId) {
        alert("Please select both a student and a course.");
        return;
    }
    const success = addEnrollment({
      ...formData,
      enrollmentDate: new Date().toISOString(),
    });
    if (success) {
      closeModal();
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ studentId: '', courseId: '' });
  };
  
  const getStudentName = (studentId: string): string => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
  };

  const getCourseName = (courseId: string): string => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : "Unknown Course";
  };
  
  const filteredEnrollments = enrollments.filter(enrollment => {
    const studentName = getStudentName(enrollment.studentId).toLowerCase();
    const courseName = getCourseName(enrollment.courseId).toLowerCase();
    const search = searchTerm.toLowerCase();
    return studentName.includes(search) || courseName.includes(search);
  });

  const dynamicHeadingStyle = headingTextColor?.startsWith('#') ? { color: headingTextColor } : {};
  const dynamicHeadingClass = headingTextColor?.startsWith('#') ? '' : headingTextColor;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className={`text-3xl font-semibold ${dynamicHeadingClass}`} style={dynamicHeadingStyle}>Manage Enrollments</h2>
        <div className="flex gap-2 w-full sm:w-auto">
             <Input 
                id="search-enrollments"
                type="text"
                placeholder="Search enrollments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 !mb-0"
            />
            <Button onClick={openModal} leftIcon={<DocumentPlusIcon className="h-5 w-5"/>}> {/* Changed Icon */}
            New Enrollment
            </Button>
        </div>
      </div>

      {filteredEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => {
            const student = students.find(s => s.id === enrollment.studentId);
            const course = courses.find(c => c.id === enrollment.courseId);
            return (
              <EnrollmentCard 
                key={enrollment.id} 
                enrollment={enrollment} 
                student={student} 
                course={course} 
                onDelete={deleteEnrollment} 
              />
            );
          })}
        </div>
      ) : (
         <div className="text-center py-10">
          <img src="https://picsum.photos/seed/empty-enrollments/400/300" alt="No enrollments found" className="mx-auto mb-4 rounded-lg shadow-md h-60 w-auto object-cover" />
          <p className="text-xl text-slate-600">No enrollments found.</p>
          {enrollments.length > 0 && searchTerm && <p className="text-sm text-slate-500">Try adjusting your search term.</p>}
          {enrollments.length === 0 && <p className="text-sm text-slate-500">Click "New Enrollment" to get started.</p>}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create New Enrollment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <select
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              <option value="" disabled>Select a student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.firstName} {student.lastName}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              <option value="" disabled>Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title} ({course.code})</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary">Enroll Student</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EnrollmentsPage;
