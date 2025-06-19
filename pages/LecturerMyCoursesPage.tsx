
import React from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { AcademicCapIcon, ArrowLeftIcon, BookOpenIcon, UsersIcon, DocumentTextIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Card from '../components/Card';

interface LecturerMyCoursesPageProps {
  appSettings: AppSettings;
}

const LecturerMyCoursesPage: React.FC<LecturerMyCoursesPageProps> = ({ appSettings }) => {
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
                <h2 className={`text-2xl font-semibold mb-6 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()}>
                    Your Teaching Hub
                </h2>
                <p className="text-slate-600 mb-4">
                  Welcome to the "My Courses" section. This is your central place to manage all aspects of the courses you are teaching. 
                  Here, you will find tools and resources to support your teaching activities and engagement with students.
                </p>
                <p className="text-slate-600 mb-6">
                  This section will eventually allow you to:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <UsersIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">View Enrolled Students:</span>
                        <p className="text-sm text-slate-500">Access rosters for each of your courses, view student details, and manage attendance (future). </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <DocumentTextIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Manage Course Materials:</span>
                        <p className="text-sm text-slate-500">Upload and organize syllabi, lecture notes, presentations, and other learning resources for your students.</p>
                    </div>
                  </li>
                   <li className="flex items-start">
                    <BookOpenIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Assignments & Quizzes:</span>
                        <p className="text-sm text-slate-500">Create, distribute, and manage assignments and quizzes. View submissions and link to the grading system.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ChatBubbleLeftRightIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Student Communication:</span>
                        <p className="text-sm text-slate-500">Engage with students through course-specific announcements or discussion forums (future feature).</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8 text-center bg-slate-50 p-6 rounded-lg">
                  <img src="https://picsum.photos/seed/lecturer-courses/450/250" alt="My Courses Placeholder" className="mx-auto rounded-lg shadow-md mb-4"/>
                  <p className="text-slate-600 text-sm">
                    Currently, this page is a placeholder. Full functionality for course management, material uploads, and student interaction will be developed here.
                  </p>
                </div>
            </div>
        </Card>
      </div>

      <div className="mt-10 text-center">
        <Link to="/lecturer-dashboard">
          <Button variant="ghost" leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
            Back to Lecturer Dashboard
          </Button>
        </Link>
      </div>
      <p className="text-center text-xs text-slate-500 mt-12">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
    </div>
  );
};

export default LecturerMyCoursesPage;
