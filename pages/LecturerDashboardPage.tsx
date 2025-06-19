
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { BookOpenIcon, PencilSquareIcon, UsersIcon, MegaphoneIcon, ArrowLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { LecturerIcon } from '../constants';


interface LecturerDashboardPageProps {
  appSettings: AppSettings;
}

const LecturerDashboardPage: React.FC<LecturerDashboardPageProps> = ({ appSettings }) => {
  const { 
    appName = DEFAULT_APP_SETTINGS.appName, 
    collegeLogo,
    lecturerDashboardPageHeading = DEFAULT_APP_SETTINGS.lecturerDashboardPageHeading,
    lecturerDashboardWelcomeText = DEFAULT_APP_SETTINGS.lecturerDashboardWelcomeText,
    lecturerDashboardMyCoursesTitle = DEFAULT_APP_SETTINGS.lecturerDashboardMyCoursesTitle,
    lecturerDashboardMyCoursesDesc = DEFAULT_APP_SETTINGS.lecturerDashboardMyCoursesDesc,
    lecturerDashboardMyCoursesButtonText = DEFAULT_APP_SETTINGS.lecturerDashboardMyCoursesButtonText,
    lecturerDashboardUploadGradesTitle = DEFAULT_APP_SETTINGS.lecturerDashboardUploadGradesTitle,
    lecturerDashboardUploadGradesDesc = DEFAULT_APP_SETTINGS.lecturerDashboardUploadGradesDesc,
    lecturerDashboardUploadGradesButtonText = DEFAULT_APP_SETTINGS.lecturerDashboardUploadGradesButtonText,
    lecturerDashboardViewStudentsTitle = DEFAULT_APP_SETTINGS.lecturerDashboardViewStudentsTitle,
    lecturerDashboardViewStudentsDesc = DEFAULT_APP_SETTINGS.lecturerDashboardViewStudentsDesc,
    lecturerDashboardViewStudentsButtonText = DEFAULT_APP_SETTINGS.lecturerDashboardViewStudentsButtonText,
    lecturerDashboardAnnouncementsTitle = DEFAULT_APP_SETTINGS.lecturerDashboardAnnouncementsTitle,
    lecturerDashboardAnnouncementsDesc = DEFAULT_APP_SETTINGS.lecturerDashboardAnnouncementsDesc,
    lecturerDashboardAnnouncementsButtonText = DEFAULT_APP_SETTINGS.lecturerDashboardAnnouncementsButtonText,
    lecturerDashboardPlaceholderImageText = DEFAULT_APP_SETTINGS.lecturerDashboardPlaceholderImageText,
  } = appSettings;

  const placeholderSections = [
    { 
      title: lecturerDashboardMyCoursesTitle, 
      icon: <BookOpenIcon className="h-8 w-8 text-sky-600" />, 
      description: lecturerDashboardMyCoursesDesc, 
      linkPath: "/lecturer-my-courses", 
      buttonText: lecturerDashboardMyCoursesButtonText 
    },
    { 
      title: lecturerDashboardUploadGradesTitle, 
      icon: <PencilSquareIcon className="h-8 w-8 text-green-600" />, 
      description: lecturerDashboardUploadGradesDesc, 
      linkPath: "/lecturer-upload-grades", 
      buttonText: lecturerDashboardUploadGradesButtonText 
    },
    { 
      title: lecturerDashboardViewStudentsTitle, 
      icon: <UsersIcon className="h-8 w-8 text-indigo-600" />, 
      description: lecturerDashboardViewStudentsDesc, 
      linkPath: "/lecturer-view-students", 
      buttonText: lecturerDashboardViewStudentsButtonText 
    },
    { 
      title: lecturerDashboardAnnouncementsTitle, 
      icon: <MegaphoneIcon className="h-8 w-8 text-amber-600" />, 
      description: lecturerDashboardAnnouncementsDesc, 
      linkPath: "/lecturer-announcements", 
      buttonText: lecturerDashboardAnnouncementsButtonText 
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
          <LecturerIcon className="h-8 w-8 mr-2 text-slate-500" /> {lecturerDashboardPageHeading}
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {placeholderSections.map(section => (
            <Card key={section.title} className="shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-5 flex flex-col items-center text-center">
                <div className="p-3 bg-slate-100 rounded-full mb-3">
                    {section.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">{section.title}</h3>
                <p className="text-sm text-slate-500 mb-4 h-12">{section.description}</p>
                <Link to={section.linkPath} className="w-full">
                  <Button variant="primary" size="sm" className="w-full">
                    {section.buttonText}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
            <img src="https://picsum.photos/seed/lecturer-dash/500/300" alt={lecturerDashboardPlaceholderImageText} className="mx-auto rounded-lg shadow-md mb-4"/>
            <p className="text-slate-500 text-sm">{lecturerDashboardWelcomeText}</p>
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

export default LecturerDashboardPage;
