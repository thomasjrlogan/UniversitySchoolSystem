
import React from 'react';
import { Course } from '../types';
import Button from './Button';
import { BookOpenIcon, HashtagIcon, InformationCircleIcon, StarIcon, BuildingLibraryIcon, TrashIcon, PencilIcon, PhotoIcon } from '@heroicons/react/24/outline'; // Added PhotoIcon for placeholder

interface CourseCardProps {
  course: Course;
  onDelete: (courseId: string) => void;
  onEdit: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onDelete, onEdit }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-2xl">
      {course.coverImageUrl ? (
        <img 
          src={course.coverImageUrl} 
          alt={`${course.title} cover`} 
          className="w-full h-40 object-cover" 
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/fallback/400/200')} // Fallback for broken links
        />
      ) : (
        <div className="w-full h-40 bg-slate-200 flex items-center justify-center">
          <PhotoIcon className="h-16 w-16 text-slate-400" />
        </div>
      )}
      <div className="p-5 flex flex-col flex-grow">
        <div>
          <div className="flex items-start mb-2">
            <BookOpenIcon className="h-7 w-7 text-sky-600 mr-2.5 mt-0.5 flex-shrink-0" />
            <h3 className="text-xl font-semibold text-sky-700 leading-tight">{course.title}</h3>
          </div>
          <p className="text-sm text-slate-600 mb-1.5 flex items-center">
            <HashtagIcon className="h-4 w-4 inline-block mr-1.5 text-slate-500 flex-shrink-0" />
            <span className="font-medium text-slate-700">Code:</span>&nbsp;{course.code}
          </p>
          {course.department && (
            <p className="text-sm text-slate-600 mb-1.5 flex items-center">
              <BuildingLibraryIcon className="h-4 w-4 inline-block mr-1.5 text-slate-500 flex-shrink-0" />
              <span className="font-medium text-slate-700">Department:</span>&nbsp;{course.department}
            </p>
          )}
          <p className="text-sm text-slate-600 mb-1.5 flex items-center">
            <StarIcon className="h-4 w-4 inline-block mr-1.5 text-slate-500 flex-shrink-0" />
            <span className="font-medium text-slate-700">Credits:</span>&nbsp;{course.credits}
          </p>
          <div className="text-sm text-slate-600 mt-2 mb-3">
            <div className="flex items-start">
              <InformationCircleIcon className="h-4 w-4 inline-block mr-1.5 text-slate-500 flex-shrink-0 mt-0.5" />
              <span className="font-medium text-slate-700">Description:</span>
            </div>
            <p className="block mt-1 ml-[1.375rem] text-xs h-16 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                {course.description || 'No description available.'}
            </p>
          </div>
        </div>
        <div className="mt-auto pt-4 flex justify-end space-x-2 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={() => onEdit(course)} leftIcon={<PencilIcon className="h-4 w-4" />}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(course.id)} leftIcon={<TrashIcon className="h-4 w-4" />}>
            Delete
          </Button>
        </div>
      </div>
       {/* Minimalistic scrollbar style can be added to a global CSS file or via a different method if needed */}
      {/* 
        Example for global CSS (e.g., index.css or App.css):
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9; 
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      */}
    </div>
  );
};

export default CourseCard;
