
import React from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { AcademicCapIcon, ArrowLeftIcon, CalendarDaysIcon, ClockIcon, MapPinIcon, UserCircleIcon as TeacherIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Card from '../components/Card';

interface StudentClassSchedulePageProps {
  appSettings: AppSettings;
}

const StudentClassSchedulePage: React.FC<StudentClassSchedulePageProps> = ({ appSettings }) => {
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
          <CalendarDaysIcon className="h-8 w-8 mr-2 text-slate-500" /> Class Schedule
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
            <div className="p-8">
                <h2 className={`text-2xl font-semibold text-slate-700 mb-6 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()}>Your Personalized Timetable</h2>
                <p className="text-slate-600 mb-4">
                This page will display your weekly class schedule, helping you stay organized and on track with your studies. You'll find information about your courses, class timings, locations, and instructors.
                </p>
                <p className="text-slate-600 mb-6">
                Key features planned for this section include:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <ClockIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Class Timings:</span>
                        <p className="text-sm text-slate-500">Clear display of start and end times for each scheduled class.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <MapPinIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Locations:</span>
                        <p className="text-sm text-slate-500">Room numbers for physical classes or links for online sessions.</p>
                    </div>
                  </li>
                   <li className="flex items-start">
                    <TeacherIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Instructor Information:</span>
                        <p className="text-sm text-slate-500">Names of the lecturers or instructors teaching each class.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CalendarDaysIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">View Options:</span>
                        <p className="text-sm text-slate-500">Ability to view your schedule by day, week, or potentially a monthly calendar overview.</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8 text-center bg-slate-50 p-6 rounded-lg">
                  <img src="https://picsum.photos/seed/student-schedule/450/250" alt="Class Schedule Placeholder" className="mx-auto rounded-lg shadow-md mb-4"/>
                  <p className="text-slate-600 text-sm">
                    This is a placeholder for your class schedule. A dynamic and interactive timetable will be available here in a future update.
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

export default StudentClassSchedulePage;
