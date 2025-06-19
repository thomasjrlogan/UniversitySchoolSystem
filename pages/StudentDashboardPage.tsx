
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { AppSettings, Student, Course, Enrollment } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { BookOpenIcon, ClipboardDocumentCheckIcon, BanknotesIcon, CalendarDaysIcon, EnvelopeIcon, ArrowLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { StudentDashboardIcon } from '../constants';

interface StudentDashboardPageProps {
  appSettings: AppSettings;
  students: Student[]; 
  courses: Course[];   
  enrollments: Enrollment[]; 
}

const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ appSettings }) => {
  const { 
    appName = DEFAULT_APP_SETTINGS.appName, 
    collegeLogo,
    studentDashboardPageHeading = DEFAULT_APP_SETTINGS.studentDashboardPageHeading,
    studentDashboardWelcomeText = DEFAULT_APP_SETTINGS.studentDashboardWelcomeText,
    studentDashboardMyCoursesTitle = DEFAULT_APP_SETTINGS.studentDashboardMyCoursesTitle,
    studentDashboardMyCoursesDesc = DEFAULT_APP_SETTINGS.studentDashboardMyCoursesDesc,
    studentDashboardMyCoursesButtonText = DEFAULT_APP_SETTINGS.studentDashboardMyCoursesButtonText,
    studentDashboardResultsPreviewTitle = DEFAULT_APP_SETTINGS.studentDashboardResultsPreviewTitle,
    studentDashboardResultsPreviewDesc = DEFAULT_APP_SETTINGS.studentDashboardResultsPreviewDesc,
    studentDashboardResultsPreviewButtonText = DEFAULT_APP_SETTINGS.studentDashboardResultsPreviewButtonText,
    studentDashboardPaymentStatusTitle = DEFAULT_APP_SETTINGS.studentDashboardPaymentStatusTitle,
    studentDashboardPaymentStatusDesc = DEFAULT_APP_SETTINGS.studentDashboardPaymentStatusDesc,
    studentDashboardPaymentStatusButtonText = DEFAULT_APP_SETTINGS.studentDashboardPaymentStatusButtonText,
    studentDashboardClassScheduleTitle = DEFAULT_APP_SETTINGS.studentDashboardClassScheduleTitle,
    studentDashboardClassScheduleDesc = DEFAULT_APP_SETTINGS.studentDashboardClassScheduleDesc,
    studentDashboardClassScheduleButtonText = DEFAULT_APP_SETTINGS.studentDashboardClassScheduleButtonText,
    studentDashboardAdminMessagesTitle = DEFAULT_APP_SETTINGS.studentDashboardAdminMessagesTitle,
    studentDashboardAdminMessagesDesc = DEFAULT_APP_SETTINGS.studentDashboardAdminMessagesDesc,
    studentDashboardAdminMessagesButtonText = DEFAULT_APP_SETTINGS.studentDashboardAdminMessagesButtonText,
    studentDashboardPlaceholderImageText = DEFAULT_APP_SETTINGS.studentDashboardPlaceholderImageText,
  } = appSettings;

  const dashboardSections = [
    { 
      title: studentDashboardMyCoursesTitle, 
      icon: <BookOpenIcon className="h-8 w-8 text-sky-600" />, 
      description: studentDashboardMyCoursesDesc, 
      linkPath: "/student-my-courses",
      buttonText: studentDashboardMyCoursesButtonText
    },
    { 
      title: studentDashboardResultsPreviewTitle, 
      icon: <ClipboardDocumentCheckIcon className="h-8 w-8 text-green-600" />, 
      description: studentDashboardResultsPreviewDesc, 
      linkPath: "/results",
      buttonText: studentDashboardResultsPreviewButtonText
    },
    { 
      title: studentDashboardPaymentStatusTitle, 
      icon: <BanknotesIcon className="h-8 w-8 text-purple-600" />, 
      description: studentDashboardPaymentStatusDesc, 
      linkPath: "/student-payment-status",
      buttonText: studentDashboardPaymentStatusButtonText
    },
    { 
      title: studentDashboardClassScheduleTitle, 
      icon: <CalendarDaysIcon className="h-8 w-8 text-indigo-600" />, 
      description: studentDashboardClassScheduleDesc, 
      linkPath: "/student-class-schedule",
      buttonText: studentDashboardClassScheduleButtonText
    },
    { 
      title: studentDashboardAdminMessagesTitle, 
      icon: <EnvelopeIcon className="h-8 w-8 text-red-600" />, 
      description: studentDashboardAdminMessagesDesc, 
      linkPath: "/student-admin-messages",
      buttonText: studentDashboardAdminMessagesButtonText
    },
  ];

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
          <StudentDashboardIcon className="h-8 w-8 mr-2 text-slate-500" /> {studentDashboardPageHeading}
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardSections.map(section => (
            <Card key={section.title} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <div className="p-5 flex flex-col items-center text-center flex-grow">
                 <div className="p-3 bg-slate-100 rounded-full mb-3">
                    {section.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">{section.title}</h3>
                <p className="text-sm text-slate-500 mb-4 h-12 flex-grow">{section.description}</p>
              </div>
              <div className="p-4 border-t bg-slate-50/50">
                 <Link to={section.linkPath} className="block">
                    <Button variant="primary" size="sm" className="w-full">
                        {section.buttonText}
                    </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        
         <div className="mt-12 text-center">
            <img src="https://picsum.photos/seed/student-dash/500/300" alt={studentDashboardPlaceholderImageText} className="mx-auto rounded-lg shadow-md mb-4"/>
            <p className="text-slate-500 text-sm">{studentDashboardWelcomeText}</p>
        </div>

        <div className="mt-10 text-center">
          <Link to="/login" className="group inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors duration-150">
            <ArrowLeftIcon className="h-4 w-4 mr-1 transition-transform duration-150 group-hover:-translate-x-1" />
            Back to Login / Main Portal
          </Link>
        </div>
      </div>
       <p className="text-center text-xs text-slate-500 mt-12">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
    </div>
  );
};

export default StudentDashboardPage;
