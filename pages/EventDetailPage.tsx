
import React from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Breadcrumb from '../components/Breadcrumb';
import { 
    AcademicCapIcon, ArrowLeftIcon, CalendarDaysIcon, MapPinIcon, UserCircleIcon, TagIcon, MagnifyingGlassIcon, ClockIcon 
} from '@heroicons/react/24/outline';

interface EventDetailPageProps {
  appSettings: AppSettings;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ appSettings }) => {
  const { 
    appName = DEFAULT_APP_SETTINGS.appName, 
    collegeLogo, 
    primaryColor: settingsPrimaryColor,
    eventDetailExampleTitle = DEFAULT_APP_SETTINGS.eventDetailExampleTitle,
    eventDetailExampleCategory = DEFAULT_APP_SETTINGS.eventDetailExampleCategory,
    eventDetailExampleDateRange = DEFAULT_APP_SETTINGS.eventDetailExampleDateRange,
    eventDetailExampleLocation = DEFAULT_APP_SETTINGS.eventDetailExampleLocation,
    eventDetailExampleOrganizer = DEFAULT_APP_SETTINGS.eventDetailExampleOrganizer,
    eventDetailExamplePublishedDate = DEFAULT_APP_SETTINGS.eventDetailExamplePublishedDate,
    eventDetailExampleDescriptionP1 = DEFAULT_APP_SETTINGS.eventDetailExampleDescriptionP1,
    eventDetailExampleDescriptionP2 = DEFAULT_APP_SETTINGS.eventDetailExampleDescriptionP2,
    eventDetailExampleHighlightsHeading = DEFAULT_APP_SETTINGS.eventDetailExampleHighlightsHeading,
    eventDetailExampleHighlight1 = DEFAULT_APP_SETTINGS.eventDetailExampleHighlight1,
    eventDetailExampleHighlight2 = DEFAULT_APP_SETTINGS.eventDetailExampleHighlight2,
    eventDetailExampleHighlight3 = DEFAULT_APP_SETTINGS.eventDetailExampleHighlight3,
    eventDetailExampleHighlight4 = DEFAULT_APP_SETTINGS.eventDetailExampleHighlight4,
    eventDetailExampleDescriptionP3 = DEFAULT_APP_SETTINGS.eventDetailExampleDescriptionP3,
    eventDetailSidebarLatestEvent1Title = DEFAULT_APP_SETTINGS.eventDetailSidebarLatestEvent1Title,
    eventDetailSidebarLatestEvent1Date = DEFAULT_APP_SETTINGS.eventDetailSidebarLatestEvent1Date,
    eventDetailSidebarLatestEvent2Title = DEFAULT_APP_SETTINGS.eventDetailSidebarLatestEvent2Title,
    eventDetailSidebarLatestEvent2Date = DEFAULT_APP_SETTINGS.eventDetailSidebarLatestEvent2Date,
    eventDetailSidebarLatestEvent3Title = DEFAULT_APP_SETTINGS.eventDetailSidebarLatestEvent3Title,
    eventDetailSidebarLatestEvent3Date = DEFAULT_APP_SETTINGS.eventDetailSidebarLatestEvent3Date,
    eventDetailSidebarLatestEvent4Title = DEFAULT_APP_SETTINGS.eventDetailSidebarLatestEvent4Title,
    eventDetailSidebarLatestEvent4Date = DEFAULT_APP_SETTINGS.eventDetailSidebarLatestEvent4Date,
    collegeAddress = DEFAULT_APP_SETTINGS.collegeAddress,
    collegePhone = DEFAULT_APP_SETTINGS.collegePhone,
  } = appSettings;

  const primaryColor = settingsPrimaryColor || DEFAULT_APP_SETTINGS.primaryColor;

  const getPrimaryColorClass = (baseClass: string = 'text', shadeOffset: number = 0): string => {
    if (primaryColor.startsWith('#')) return '';
    const [color, shadeStr = '600'] = primaryColor.split('-');
    const targetShade = Math.min(900, Math.max(100, parseInt(shadeStr, 10) + shadeOffset));
    return `${baseClass}-${color}-${targetShade}`;
  };

  const getPrimaryColorStyle = (property: 'color' | 'backgroundColor' | 'borderColor' = 'color'): React.CSSProperties => {
    if (primaryColor.startsWith('#')) return { [property]: primaryColor };
    return {};
  };

  const breadcrumbItems = [
    { name: 'Events', path: '#' }, 
    { name: eventDetailExampleTitle || 'Event Detail' }
  ];

  const sidebarYears = ['2024', '2023', '2022', '2021']; 
  const sidebarMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const latestEvents = [
    { title: eventDetailSidebarLatestEvent1Title, date: eventDetailSidebarLatestEvent1Date, link: '#' },
    { title: eventDetailSidebarLatestEvent2Title, date: eventDetailSidebarLatestEvent2Date, link: '#' },
    { title: eventDetailSidebarLatestEvent3Title, date: eventDetailSidebarLatestEvent3Date, link: '#' },
    { title: eventDetailSidebarLatestEvent4Title, date: eventDetailSidebarLatestEvent4Date, link: '#' },
  ].filter(event => event.title && event.date);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              {collegeLogo ? (
                <img src={collegeLogo} alt={`${appName} Logo`} className="h-10 sm:h-12 w-auto object-contain" />
              ) : (
                <AcademicCapIcon className={`h-10 sm:h-12 w-auto ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
              )}
              <div>
                <span className={`text-xl sm:text-2xl font-bold ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()}>{appName}</span>
                <span className="block text-sm text-slate-500 -mt-1">Event Detail</span>
              </div>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeftIcon className="h-4 w-4"/>}>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb items={breadcrumbItems} primaryColor={primaryColor} />
        </div>
      </div>
      
      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Event Details (Main Column) */}
          <div className="lg:w-3/4">
            <Card className="shadow-lg overflow-hidden">
              <img 
                src="https://picsum.photos/seed/studytour/800/450" 
                alt={eventDetailExampleTitle} 
                className="w-full h-64 sm:h-80 md:h-96 object-cover" 
              />
              <div className="p-6 sm:p-8">
                {eventDetailExampleCategory && (
                  <div className="mb-4">
                    <span className={`inline-block bg-opacity-10 px-3 py-1 text-xs font-semibold rounded-full ${getPrimaryColorClass('bg')} ${getPrimaryColorClass('text')}`} style={{backgroundColor: primaryColor.startsWith('#') ? `${primaryColor}1A` : '', ...getPrimaryColorStyle()}}>
                      {eventDetailExampleCategory}
                    </span>
                  </div>
                )}
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">{eventDetailExampleTitle}</h1>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 mb-6 border-b pb-4">
                  {eventDetailExampleDateRange && (
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-5 w-5 mr-1.5 text-slate-500" />
                      <span>{eventDetailExampleDateRange}</span>
                    </div>
                  )}
                  {eventDetailExampleLocation && (
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-1.5 text-slate-500" />
                      <span>{eventDetailExampleLocation}</span>
                    </div>
                  )}
                  {eventDetailExampleOrganizer && (
                    <div className="flex items-center">
                      <UserCircleIcon className="h-5 w-5 mr-1.5 text-slate-500" />
                      <span>By {eventDetailExampleOrganizer}</span>
                    </div>
                  )}
                  {eventDetailExamplePublishedDate && (
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 mr-1.5 text-slate-500" />
                      <span>Published: {eventDetailExamplePublishedDate}</span>
                    </div>
                  )}
                </div>

                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                  {eventDetailExampleDescriptionP1 && <p>{eventDetailExampleDescriptionP1}</p>}
                  {eventDetailExampleDescriptionP2 && <p>{eventDetailExampleDescriptionP2}</p>}
                  
                  {eventDetailExampleHighlightsHeading && (eventDetailExampleHighlight1 || eventDetailExampleHighlight2 || eventDetailExampleHighlight3 || eventDetailExampleHighlight4) && (
                    <>
                      <h3 className={`font-semibold ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()}>{eventDetailExampleHighlightsHeading}</h3>
                      <ul>
                        {eventDetailExampleHighlight1 && <li>{eventDetailExampleHighlight1}</li>}
                        {eventDetailExampleHighlight2 && <li>{eventDetailExampleHighlight2}</li>}
                        {eventDetailExampleHighlight3 && <li>{eventDetailExampleHighlight3}</li>}
                        {eventDetailExampleHighlight4 && <li>{eventDetailExampleHighlight4}</li>}
                      </ul>
                    </>
                  )}
                  {eventDetailExampleDescriptionP3 && <p>{eventDetailExampleDescriptionP3}</p>}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/4 space-y-6">
            <Card className="shadow-md">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 mr-2 text-slate-500" />
                  Filter by Date
                </h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="event-year" className="block text-sm font-medium text-slate-600 mb-1">Year</label>
                    <select id="event-year" className="block w-full text-sm p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500">
                      <option>Select Year</option>
                      {sidebarYears.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="event-month" className="block text-sm font-medium text-slate-600 mb-1">Month</label>
                    <select id="event-month" className="block w-full text-sm p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500">
                      <option>Select Month</option>
                      {sidebarMonths.map(month => <option key={month} value={month}>{month}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="event-day" className="block text-sm font-medium text-slate-600 mb-1">Day</label>
                    <Input id="event-day" type="number" placeholder="Day (e.g., 15)" className="text-sm !py-2" />
                  </div>
                  <Button variant="primary" className={`w-full ${getPrimaryColorClass('bg')} hover:${getPrimaryColorClass('bg', 100)}`} style={primaryColor.startsWith('#') ? {backgroundColor: primaryColor} : {}}>
                    Find Events
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="shadow-md">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2 text-slate-500" />
                  Search Events
                </h3>
                <Input id="event-search" type="search" placeholder="Search..." className="!py-2" />
              </div>
            </Card>

            {latestEvents.length > 0 && (
              <Card className="shadow-md">
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                    <TagIcon className="h-5 w-5 mr-2 text-slate-500" />
                    Latest Events
                  </h3>
                  <ul className="space-y-3">
                    {latestEvents.map(event => (
                      <li key={event.title} className="border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
                        <Link to={event.link} className={`block text-sm font-medium text-slate-600 hover:${getPrimaryColorClass()}`} style={primaryColor.startsWith('#') ? { '--hover-text-color': primaryColor } as React.CSSProperties : {}}
                        onMouseEnter={e => primaryColor.startsWith('#') && (e.currentTarget.style.color = primaryColor) }
                        onMouseLeave={e => primaryColor.startsWith('#') && (e.currentTarget.style.color = '')}>
                          {event.title}
                        </Link>
                        <p className="text-xs text-slate-400">{event.date}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-8 text-center mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-semibold text-lg text-white mb-1">{appName}</p>
          <p className="text-sm">{collegeAddress}</p>
          <p className="text-sm">Tel: {collegePhone}</p>
          <p className="text-xs mt-4">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default EventDetailPage;
