
import React from 'react';
import { Student } from '../types';
import Button from './Button';
import { UserIcon, CakeIcon, AcademicCapIcon, TrashIcon, PencilIcon, ChatBubbleBottomCenterTextIcon, IdentificationIcon } from '@heroicons/react/24/outline';

interface StudentCardProps {
  student: Student;
  onDelete: (studentId: string) => void;
  onEdit: (student: Student) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onDelete, onEdit }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start mb-4">
          {student.passportPhoto?.fileData ? (
            <img 
              src={student.passportPhoto.fileData} 
              alt={`${student.firstName} ${student.lastName}'s photo`}
              className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-slate-200 shadow-sm"
            />
          ) : (
            <UserIcon className="h-16 w-16 text-slate-300 bg-slate-100 p-2 rounded-full mr-4" />
          )}
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-sky-700">{student.firstName} {student.lastName}</h3>
            {student.studentIdNumber && (
              <p className="text-xs text-slate-500 mt-0.5">
                ID: {student.studentIdNumber}
              </p>
            )}
            <p className="text-sm text-slate-600 break-all mt-1">{student.email}</p>
          </div>
        </div>
        
        <div className="space-y-1.5 text-sm text-slate-600">
          <p>
            <CakeIcon className="h-4 w-4 inline-block mr-1.5 text-slate-500" />
            <span className="font-medium text-slate-700">DOB:</span> {student.dateOfBirth}
          </p>
          {student.major && (
            <p>
              <AcademicCapIcon className="h-4 w-4 inline-block mr-1.5 text-slate-500" />
              <span className="font-medium text-slate-700">Major:</span> {student.major}
            </p>
          )}
        </div>

        {student.adminProgressNotes && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-1 font-medium flex items-center">
              <ChatBubbleBottomCenterTextIcon className="h-4 w-4 inline-block mr-1 text-blue-500" />
              Admin Notes:
            </p>
            <p className="text-xs text-slate-600 italic bg-blue-50 p-2 rounded-md whitespace-pre-wrap">
              {student.adminProgressNotes}
            </p>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end space-x-2 border-t pt-4 border-slate-100">
        <Button variant="ghost" size="sm" onClick={() => onEdit(student)} leftIcon={<PencilIcon className="h-4 w-4" />}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(student.id)} leftIcon={<TrashIcon className="h-4 w-4" />}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default StudentCard;
