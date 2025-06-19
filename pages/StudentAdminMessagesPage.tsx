
import React from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { AcademicCapIcon, ArrowLeftIcon, EnvelopeIcon, BellAlertIcon, ArchiveBoxIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Card from '../components/Card';

interface StudentAdminMessagesPageProps {
  appSettings: AppSettings;
}

const StudentAdminMessagesPage: React.FC<StudentAdminMessagesPageProps> = ({ appSettings }) => {
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
          <EnvelopeIcon className="h-8 w-8 mr-2 text-slate-500" /> Admin Messages &amp; Announcements
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
            <div className="p-8">
                <h2 className={`text-2xl font-semibold text-slate-700 mb-6 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()}>
                    Your Communication Center
                </h2>
                <p className="text-slate-600 mb-4">
                This page will serve as your dedicated inbox for all official communications from the university administration. It's crucial to check this section regularly for important updates, announcements, and notifications.
                </p>
                <p className="text-slate-600 mb-6">
                When fully implemented, this section will feature:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <BellAlertIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Notification System:</span>
                        <p className="text-sm text-slate-500">Receive alerts for new messages, important deadlines, policy changes, campus events, and other institutional news.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <EnvelopeIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Message Viewing:</span>
                        <p className="text-sm text-slate-500">Read messages in a clear, organized format. Messages may include attachments or links for more details.</p>
                    </div>
                  </li>
                   <li className="flex items-start">
                    <ArchiveBoxIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Message Management:</span>
                        <p className="text-sm text-slate-500">Mark messages as read or unread, and potentially archive important communications for future reference.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <MagnifyingGlassIcon className={`h-6 w-6 mr-3 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                    <div>
                        <span className="font-semibold text-slate-700">Search &amp; Filter:</span>
                        <p className="text-sm text-slate-500">Easily search through your messages or filter them by date, sender, or category (e.g., "Academic", "Financial", "Events").</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8 text-center bg-slate-50 p-6 rounded-lg">
                  <img src="https://picsum.photos/seed/student-messages/450/250" alt="Admin Messages Placeholder" className="mx-auto rounded-lg shadow-md mb-4"/>
                  <p className="text-slate-600 text-sm">
                    This page is currently a placeholder. A fully functional messaging system for administrative announcements will be implemented here.
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

export default StudentAdminMessagesPage;
