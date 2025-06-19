
import React from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { AcademicCapIcon, ArrowLeftIcon, UsersIcon, MagnifyingGlassIcon, DocumentTextIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Card from '../components/Card';

interface LecturerViewStudentsPageProps {
  appSettings: AppSettings;
}

const LecturerViewStudentsPage: React.FC<LecturerViewStudentsPageProps> = ({ appSettings }) => {
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
          <UsersIcon className="h-8 w-8 mr-2 text-slate-500" /> View Enrolled Students
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
         <Card className="shadow-xl">
            <div className="p-8">
                <h2 className={`text-2xl font-semibold mb-6 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()}>Student Rosters &amp; Information</h2>
                <p className="text-slate-600 mb-4">
                  This page will provide lecturers with access to view lists of students enrolled in their specific courses. It's designed to help you quickly find student information and manage your classes effectively.
                </p>
                <p className="text-slate-600 mb-6">
                  Key features planned for this section include:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <DocumentTextIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Course-Specific Rosters:</span>
                        <p className="text-sm text-slate-500">Select a course you teach to view a detailed list of all enrolled students.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <MagnifyingGlassIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Search and Filter:</span>
                        <p className="text-sm text-slate-500">Easily search for specific students within a course or filter by various criteria.</p>
                    </div>
                  </li>
                   <li className="flex items-start">
                    <UsersIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Student Details:</span>
                        <p className="text-sm text-slate-500">View essential student information such as name, student ID, and email address.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <EnvelopeIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Communication Tools (Future):</span>
                        <p className="text-sm text-slate-500">Quick links or options to email individual students or groups within a course.</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8 text-center bg-slate-50 p-6 rounded-lg">
                  <img src="https://picsum.photos/seed/lecturer-roster/450/250" alt="View Students Placeholder" className="mx-auto rounded-lg shadow-md mb-4"/>
                  <p className="text-slate-600 text-sm">
                    This is a placeholder page. Once implemented, you will be able to select your courses and view detailed student rosters here.
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

export default LecturerViewStudentsPage;
