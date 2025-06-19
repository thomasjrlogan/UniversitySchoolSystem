
import React from 'react';
import { Enrollment, Student, Course } from '../types';
import Button from './Button';
import { ClipboardDocumentCheckIcon, UserCircleIcon, BookOpenIcon, CalendarDaysIcon, CheckBadgeIcon, TrashIcon } from '@heroicons/react/24/outline';

interface EnrollmentCardProps {
  enrollment: Enrollment;
  student?: Student;
  course?: Course;
  onDelete: (enrollmentId: string) => void;
}

const EnrollmentCard: React.FC<EnrollmentCardProps> = ({ enrollment, student, course, onDelete }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <ClipboardDocumentCheckIcon className="h-8 w-8 text-sky-600 mr-3" />
        <h3 className="text-lg font-semibold text-sky-700">Enrollment ID: {enrollment.id.substring(0,8)}...</h3>
      </div>
      
      <div className="space-y-2 text-sm text-slate-600">
        <p>
          <UserCircleIcon className="h-4 w-4 inline-block mr-1 text-slate-500" />
          <span className="font-medium text-slate-700">Student:</span> {student ? `${student.firstName} ${student.lastName}` : 'N/A'} (ID: {enrollment.studentId.substring(0,8)}...)
        </p>
        <p>
          <BookOpenIcon className="h-4 w-4 inline-block mr-1 text-slate-500" />
          <span className="font-medium text-slate-700">Course:</span> {course ? course.title : 'N/A'} (ID: {enrollment.courseId.substring(0,8)}...)
        </p>
        <p>
          <CalendarDaysIcon className="h-4 w-4 inline-block mr-1 text-slate-500" />
          <span className="font-medium text-slate-700">Enrolled:</span> {new Date(enrollment.enrollmentDate).toLocaleDateString()}
        </p>
        {enrollment.grade && (
          <p>
            <CheckBadgeIcon className="h-4 w-4 inline-block mr-1 text-green-500" />
            <span className="font-medium text-slate-700">Grade:</span> {enrollment.grade}
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end border-t pt-4 border-slate-100">
        <Button variant="danger" size="sm" onClick={() => onDelete(enrollment.id)} leftIcon={<TrashIcon className="h-4 w-4" />}>
          Unenroll
        </Button>
      </div>
    </div>
  );
};

export default EnrollmentCard;
