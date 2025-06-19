
import React from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { AcademicCapIcon, ArrowLeftIcon, BookOpenIcon, DocumentTextIcon, ChatBubbleLeftEllipsisIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Card from '../components/Card';

interface StudentMyCoursesPageProps {
  appSettings: AppSettings;
}

const StudentMyCoursesPage: React.FC<StudentMyCoursesPageProps> = ({ appSettings }) => {
  const { 
    appName = DEFAULT_APP_SETTINGS.appName, 
    collegeLogo 
  } = appSettings;

  const primaryColor = appSettings.primaryColor || DEFAULT_APP_SETTINGS.primaryColor || 'sky-600';

  const getPrimaryColorClass = (baseClass: string = 'text'): string => {
    if (primaryColor.startsWith('#')) return '';
    const [color, shade = '600'] = primaryColor.split('-');
    return `${baseClass}-${color}-${shade}`;
  };

  const getPrimaryColorStyle = (): React.CSSProperties => {
    if (primaryColor.startsWith('#')) return { color: primaryColor };
    return {};
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-10">
        {collegeLogo ? (
            <img src={collegeLogo} alt={`${appName} Logo`} className="h-20 w-auto object-contain mx-auto mb-2 rounded-md" />
        ) : (
            <AcademicCapIcon className="h-16 w-16 text-sky-600 mx-auto mb-2" />
        )}
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">{appName}</h1>
        <p className="text-2xl text-slate-600 mt-2 flex items-center justify-center">
          <BookOpenIcon className="h-8 w-8 mr-2 text-slate-500" /> My Courses
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
            <div className="p-8">
                <h2 className={`text-2xl font-semibold text-slate-700 mb-6 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()}>Your Learning Portal</h2>
                <p className="text-slate-600 mb-4">
                Welcome to your "My Courses" page! This will be your central hub for accessing all information and materials related to the courses you are currently enrolled in.
                </p>
                <p className="text-slate-600 mb-6">
                Here’s what you can expect to find in this section once fully developed:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <DocumentTextIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Course Materials:</span>
                        <p className="text-sm text-slate-500">Access syllabi, lecture notes, presentations, readings, and other resources uploaded by your instructors.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <BookOpenIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Assignments &amp; Submissions:</span>
                        <p className="text-sm text-slate-500">View upcoming assignments, download assignment briefs, and submit your work directly through the portal.</p>
                    </div>
                  </li>
                   <li className="flex items-start">
                    <VideoCameraIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Lecture Recordings (if available):</span>
                        <p className="text-sm text-slate-500">Access recordings of past lectures if provided by your instructors for review.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ChatBubbleLeftEllipsisIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Course Announcements &amp; Discussions:</span>
                        <p className="text-sm text-slate-500">Stay updated with announcements from your lecturers and participate in course-specific discussion forums.</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8 text-center bg-slate-50 p-6 rounded-lg">
                  <img src="https://picsum.photos/seed/student-courses/450/250" alt="My Courses Placeholder" className="mx-auto rounded-lg shadow-md mb-4"/>
                  <p className="text-slate-600 text-sm">
                    Currently, this page serves as a placeholder. Detailed course listings and interactive features are planned for future updates.
                  </p>
                </div>
            </div>
        </Card>
      </div>

      <div className="mt-10 text-center">
        <Link to="/student-dashboard">
          <Button variant="ghost" leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
            Back to Student Dashboard
          </Button>
        </Link>
      </div>
      <p className="text-center text-xs text-slate-500 mt-12">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
    </div>
  );
};

export default StudentMyCoursesPage;
