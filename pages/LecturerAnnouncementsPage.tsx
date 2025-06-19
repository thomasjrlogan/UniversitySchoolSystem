
import React from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { AcademicCapIcon, ArrowLeftIcon, MegaphoneIcon, PencilSquareIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Card from '../components/Card';

interface LecturerAnnouncementsPageProps {
  appSettings: AppSettings;
}

const LecturerAnnouncementsPage: React.FC<LecturerAnnouncementsPageProps> = ({ appSettings }) => {
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
          <MegaphoneIcon className="h-8 w-8 mr-2 text-slate-500" /> Announcements
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
         <Card className="shadow-xl">
            <div className="p-8">
                <h2 className={`text-2xl font-semibold mb-6 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()}>Course &amp; General Announcements</h2>
                <p className="text-slate-600 mb-4">
                  This section is designed for lecturers to create, manage, and view announcements for their students. Effective communication is key to a successful learning environment, and this tool will help you keep your students informed.
                </p>
                <p className="text-slate-600 mb-6">
                  Future capabilities of this page will include:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <PencilSquareIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Create Announcements:</span>
                        <p className="text-sm text-slate-500">A simple form to compose announcements with titles, rich text content, and options to target specific courses or all your students.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <EyeIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">View & Manage Existing Announcements:</span>
                        <p className="text-sm text-slate-500">A list of all announcements you've created, with options to view details, edit, or delete them.</p>
                    </div>
                  </li>
                   <li className="flex items-start">
                    <MegaphoneIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Audience Targeting:</span>
                        <p className="text-sm text-slate-500">Ability to specify whether an announcement is for a particular course or a general message for all students you teach.</p>
                    </div>
                  </li>
                   <li className="flex items-start">
                    <TrashIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Scheduling (Future):</span>
                        <p className="text-sm text-slate-500">Option to schedule announcements to be published at a future date and time.</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8 text-center bg-slate-50 p-6 rounded-lg">
                  <img src="https://picsum.photos/seed/lecturer-announce/450/250" alt="Announcements Placeholder" className="mx-auto rounded-lg shadow-md mb-4"/>
                  <p className="text-slate-600 text-sm">
                    This page is currently a conceptual outline. The tools for creating and managing announcements will be developed here.
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

export default LecturerAnnouncementsPage;
