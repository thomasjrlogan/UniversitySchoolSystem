
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings, Page } from '../types'; // Added Page import
import { DEFAULT_APP_SETTINGS, FacebookIcon, WhatsAppIcon } from '../constants'; // Import default settings and new icons
import { 
    AcademicCapIcon, UserPlusIcon, DocumentMagnifyingGlassIcon, ArrowRightIcon, 
    BuildingLibraryIcon, InformationCircleIcon, NewspaperIcon, CheckCircleIcon, 
    HomeIcon as NavHomeIcon, MegaphoneIcon, UserGroupIcon, CalendarDaysIcon, PhotoIcon as NavPhotoIcon, UsersIcon as TeacherIcon, ChatBubbleLeftEllipsisIcon, Bars3Icon, XMarkIcon, ChevronDownIcon, CalendarIcon as EventsIcon, BanknotesIcon, VideoCameraIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Card from '../components/Card'; 

// Extend the Window interface to include FB
declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
      // Add other FB methods if needed
    };
  }
}

interface PublicHomePageProps {
  appSettings: AppSettings;
}

interface PublicNavLinkItem {
  name: string;
  path: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; 
}

const publicNavLinks: PublicNavLinkItem[] = [
  { name: Page.PublicHome, path: '/', icon: <NavHomeIcon className="h-5 w-5 mr-1" /> },
  { name: Page.Events, path: '/event-detail', icon: <EventsIcon className="h-5 w-5 mr-1" /> },
  { name: Page.StudentDashboard, path: '/student-dashboard', icon: <UserGroupIcon className="h-5 w-5 mr-1" /> },
  { name: Page.Gallery, path: '/gallery', icon: <NavPhotoIcon className="h-5 w-5 mr-1" /> },
  { name: Page.LecturerDashboard, path: '/lecturer-dashboard', icon: <TeacherIcon className="h-5 w-5 mr-1" /> },
  { name: Page.Applications, path: '/apply', icon: <UserPlusIcon className="h-5 w-5 mr-1" /> },
  { name: Page.Results, path: '/results', icon: <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-1" /> },
  { name: Page.ContactUs, path: '/contact', icon: <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-1" /> },
];


const PublicHomePage: React.FC<PublicHomePageProps> = ({ appSettings }) => {
  const { 
    appName, collegeAddress, collegePhone, collegeLogo, collegeWhatsApp,
    facebookPageId, facebookPageUrl, facebookThemeColor
  } = appSettings;
  const primaryColor = appSettings.primaryColor || DEFAULT_APP_SETTINGS.primaryColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use values from appSettings or fall back to defaults
  const heroTagline = appSettings.heroTagline || DEFAULT_APP_SETTINGS.heroTagline;
  const aboutCardButtonText = appSettings.aboutCardButtonText || DEFAULT_APP_SETTINGS.aboutCardButtonText;
  const exploreProgramsButtonText = appSettings.exploreProgramsButtonText || DEFAULT_APP_SETTINGS.exploreProgramsButtonText;

  const whyChooseHeading = (appSettings.whyChooseHeading || DEFAULT_APP_SETTINGS.whyChooseHeading || "Why Choose {appName}?").replace('{appName}', appName);
  const whyChooseDescription = (appSettings.whyChooseDescription || DEFAULT_APP_SETTINGS.whyChooseDescription || "At {appName}, we are committed...").replace('{appName}', appName);
  const whyChooseFeature1 = appSettings.whyChooseFeature1 || DEFAULT_APP_SETTINGS.whyChooseFeature1;
  const whyChooseFeature2 = appSettings.whyChooseFeature2 || DEFAULT_APP_SETTINGS.whyChooseFeature2;
  const whyChooseFeature3 = appSettings.whyChooseFeature3 || DEFAULT_APP_SETTINGS.whyChooseFeature3;
  const whyChooseFeature4 = appSettings.whyChooseFeature4 || DEFAULT_APP_SETTINGS.whyChooseFeature4;
  
  const mobileMoneyCardTitle = appSettings.publicHomeMobileMoneyCardTitle || DEFAULT_APP_SETTINGS.publicHomeMobileMoneyCardTitle;
  const mobileMoneyCardDesc = appSettings.publicHomeMobileMoneyCardDesc || DEFAULT_APP_SETTINGS.publicHomeMobileMoneyCardDesc;
  const mobileMoneyButtonText = appSettings.publicHomeMobileMoneyButtonText || DEFAULT_APP_SETTINGS.publicHomeMobileMoneyButtonText;

  const youTubeSectionTitle = appSettings.publicHomeYouTubeSectionTitle || DEFAULT_APP_SETTINGS.publicHomeYouTubeSectionTitle;
  const youTubeSectionDesc = appSettings.publicHomeYouTubeSectionDesc || DEFAULT_APP_SETTINGS.publicHomeYouTubeSectionDesc;
  const youTubeVideoUrl = appSettings.publicHomeYouTubeVideoUrl || DEFAULT_APP_SETTINGS.publicHomeYouTubeVideoUrl;
  const youTubeChannelUrl = appSettings.publicHomeYouTubeChannelUrl || DEFAULT_APP_SETTINGS.publicHomeYouTubeChannelUrl;
  const youTubeButtonText = appSettings.publicHomeYouTubeButtonText || DEFAULT_APP_SETTINGS.publicHomeYouTubeButtonText;


  useEffect(() => {
    // For Facebook Messenger Plugin
    if (facebookPageId && facebookPageId !== "1234567890") {
        if (window.FB && window.FB.XFBML) {
          window.FB.XFBML.parse();
        }
        const chatbox = document.getElementById('fb-customer-chat');
        if (chatbox) {
          chatbox.setAttribute("page_id", facebookPageId);
          let themeColorToUse = "#0ea5e9"; // Default sky-500 like
          if (appSettings.facebookThemeColor && appSettings.facebookThemeColor.startsWith("#")) {
            themeColorToUse = appSettings.facebookThemeColor;
          } else if (appSettings.primaryColor && appSettings.primaryColor.startsWith("#")) {
            themeColorToUse = appSettings.primaryColor;
          }
          chatbox.setAttribute("theme_color", themeColorToUse);
        }
    }
  }, [facebookPageId, appSettings.facebookThemeColor, appSettings.primaryColor]);


  // Helper function to get Tailwind text color class for primaryColor
  const getPrimaryColorClass = (isHover: boolean = false): string => {
    if (primaryColor.startsWith('#')) return ''; // No class if hex, style prop will handle it
    const [color, shadeStr = '600'] = primaryColor.split('-');
    const baseShade = parseInt(shadeStr, 10);
    let targetShade = baseShade;
    if (isHover) {
      targetShade = Math.min(900, baseShade + 100);
      if (baseShade <= 100 && baseShade > 0) targetShade = Math.min(900, baseShade + 200); // Light colors darken more (avoid 0 shade)
      else if (baseShade === 0) targetShade = 100; // prevent -0 or similar issues
    }
    return `text-${color}-${targetShade}`;
  };

  // Helper function to get style object for primaryColor if it's hex
  const getPrimaryColorStyle = (): React.CSSProperties => {
    if (primaryColor.startsWith('#')) return { color: primaryColor };
    return {};
  };
  
  const getButtonBgColor = (): string => {
    if (primaryColor.startsWith('#')) return ''; 
    return `bg-${primaryColor}`;
  };

  const getButtonHoverBgColor = (): string => {
    if (primaryColor.startsWith('#')) return '';
    const [color, shade] = primaryColor.split('-');
    if (shade) {
      const numericShade = parseInt(shade);
      if (numericShade < 900 && numericShade > 0) return `hover:bg-${color}-${Math.min(900, numericShade + 100)}`;
      if (numericShade === 0) return `hover:bg-${color}-100`;
      return `hover:bg-${color}-${shade}`;
    }
    return `hover:bg-sky-700`; // Fallback for color names without shades or invalid ones
  };
  
  const getButtonTextColor = (): string => {
     if (primaryColor.startsWith('#')) return 'text-white'; // Default for hex, assuming dark backgrounds for hex buttons
     const [colorName, shadeStr = '600'] = primaryColor.split('-');
     const shade = parseInt(shadeStr, 10);
     // For very light primary colors, use darker text on buttons
     if ((colorName === 'yellow' || colorName === 'lime' || colorName === 'cyan' || colorName === 'sky' || colorName === 'indigo' || colorName === 'purple' || colorName === 'pink') && shade < 500) {
         return `text-${colorName}-800`;
     }
     return 'text-white';
  };

  const ringColorName = primaryColor.startsWith('#') ? 'sky' : primaryColor.split('-')[0];


  const heroButtonClass = `
    ${getButtonBgColor()} 
    ${getButtonTextColor()} 
    ${getButtonHoverBgColor()}
    font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105
  `;
   const heroButtonStyle = primaryColor.startsWith('#') ? { backgroundColor: primaryColor } : {};

  const formatTelLink = (phone?: string) => {
    if (!phone) return '#';
    return `tel:${phone.replace(/\D/g, '')}`;
  };

  const getYouTubeEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    let videoId = null;
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const finalYouTubeEmbedUrl = getYouTubeEmbedUrl(youTubeVideoUrl);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <Link to="/" className="flex items-center space-x-2">
              {collegeLogo ? (
                <img src={collegeLogo} alt={`${appName} Logo`} className="h-10 sm:h-12 w-auto object-contain" />
              ) : (
                <AcademicCapIcon className={`h-10 sm:h-12 w-auto ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
              )}
              <span className={`text-xl sm:text-2xl font-bold ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()}>{appName}</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-3">
              {publicNavLinks.map(link => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`text-slate-600 ${getPrimaryColorClass(true) ? `hover:${getPrimaryColorClass(true)}` : ''} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  style={primaryColor.startsWith('#') && getPrimaryColorClass(true) === '' ? { '--hover-text-color': primaryColor } as React.CSSProperties : {}}
                  onMouseEnter={e => primaryColor.startsWith('#') && (e.currentTarget.style.color = primaryColor) }
                  onMouseLeave={e => primaryColor.startsWith('#') && (e.currentTarget.style.color = '')}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/login">
                <Button 
                    variant='primary' 
                    size="sm" 
                    className={`${getButtonBgColor()} ${getButtonTextColor()} ${getButtonHoverBgColor()}`}
                    style={primaryColor.startsWith('#') ? {backgroundColor: primaryColor} : {}}
                >
                    Login
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md ${getPrimaryColorClass()} ${getPrimaryColorClass(true) ? `hover:${getPrimaryColorClass(true)}` : ''} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-${ringColorName}-500`}
                style={getPrimaryColorStyle()}
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-7 w-7" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-7 w-7" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-40" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {publicNavLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 ${getPrimaryColorClass(true) ? `hover:${getPrimaryColorClass(true)}`: ''} flex items-center`}
                  style={primaryColor.startsWith('#') && getPrimaryColorClass(true) === '' ? { '--hover-text-color': primaryColor } as React.CSSProperties : {}}
                  onMouseEnter={e => primaryColor.startsWith('#') && (e.currentTarget.style.color = primaryColor) }
                  onMouseLeave={e => primaryColor.startsWith('#') && (e.currentTarget.style.color = '')}
                >
                  {React.cloneElement(link.icon, { className: `h-5 w-5 mr-2 ${getPrimaryColorClass()}`, style: getPrimaryColorStyle() })}
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${getButtonTextColor()} ${getButtonBgColor()} hover:${getButtonHoverBgColor()} mt-2`}
                style={primaryColor.startsWith('#') ? {backgroundColor: primaryColor} : {}}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-24 sm:py-32 md:py-40" 
        style={{ backgroundImage: "url('https://picsum.photos/seed/cuchome/1600/900')" }}
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 bg-slate-800 opacity-60"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            Welcome to {appName}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
            {heroTagline}
          </p>
          <Link to="/apply">
            <button className={heroButtonClass} style={heroButtonStyle}>
              Start Your Journey Today <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 text-slate-800`}>Explore Our University</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="p-6">
                <UserPlusIcon className={`h-16 w-16 mx-auto mb-4 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Admissions Open</h3>
                <p className="text-slate-500 mb-4 text-sm">
                  Discover our programs and start your application. We offer a variety of degrees and diplomas.
                </p>
                <Link to="/apply">
                  <Button variant="secondary" className={getPrimaryColorClass() ? `!${getPrimaryColorClass()}` : ''} style={getPrimaryColorStyle()}>Apply Now</Button>
                </Link>
              </div>
            </Card>
            <Card className="text-center shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="p-6">
                <DocumentMagnifyingGlassIcon className={`h-16 w-16 mx-auto mb-4 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Student Resources</h3>
                <p className="text-slate-500 mb-4 text-sm">
                  Access your academic records, check results, and find important student resources.
                </p>
                 <div className="space-y-2">
                    <Link to="/results">
                        <Button variant="secondary" className={`w-full ${getPrimaryColorClass() ? `!${getPrimaryColorClass()}` : ''}`} style={getPrimaryColorStyle()}>Check Results</Button>
                    </Link>
                    <Link to="/student-dashboard">
                        <Button variant="ghost" className="w-full">Student Portal</Button>
                    </Link>
                 </div>
              </div>
            </Card>
            <Card className="text-center shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="p-6">
                <BuildingLibraryIcon className={`h-16 w-16 mx-auto mb-4 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">About {appName}</h3>
                <p className="text-slate-500 mb-4 text-sm">
                  Learn about our history, mission, values, and the vibrant community at our institution.
                </p>
                <Button variant="secondary" onClick={() => alert('About Us page coming soon!')} className={getPrimaryColorClass() ? `!${getPrimaryColorClass()}` : ''} style={getPrimaryColorStyle()}>{aboutCardButtonText}</Button>
              </div>
            </Card>
            <Card className="text-center shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="p-6">
                <BanknotesIcon className={`h-16 w-16 mx-auto mb-4 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">{mobileMoneyCardTitle}</h3>
                <p className="text-slate-500 mb-4 text-sm">
                  {mobileMoneyCardDesc}
                </p>
                <Link to="/student-payment-status">
                  <Button variant="secondary" className={getPrimaryColorClass() ? `!${getPrimaryColorClass()}` : ''} style={getPrimaryColorStyle()}>{mobileMoneyButtonText}</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20 bg-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">{whyChooseHeading}</h2>
              <p className="text-slate-600 mb-3">
                {whyChooseDescription}
              </p>
              <ul className="space-y-2 text-slate-600 mb-6">
                {whyChooseFeature1 && <li className="flex items-center"><CheckCircleIcon className={`h-5 w-5 mr-2 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} /> {whyChooseFeature1}</li>}
                {whyChooseFeature2 && <li className="flex items-center"><CheckCircleIcon className={`h-5 w-5 mr-2 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} /> {whyChooseFeature2}</li>}
                {whyChooseFeature3 && <li className="flex items-center"><CheckCircleIcon className={`h-5 w-5 mr-2 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} /> {whyChooseFeature3}</li>}
                {whyChooseFeature4 && <li className="flex items-center"><CheckCircleIcon className={`h-5 w-5 mr-2 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} /> {whyChooseFeature4}</li>}
              </ul>
              <Link to="/apply">
                 <button className={heroButtonClass} style={heroButtonStyle}>
                    {exploreProgramsButtonText}
                </button>
              </Link>
            </div>
            <div>
              <img src="https://picsum.photos/seed/cucstudents/600/400" alt="Students at CUC" className="rounded-lg shadow-xl w-full h-auto object-cover"/>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Video Section */}
      {finalYouTubeEmbedUrl && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <VideoCameraIcon className={`h-12 w-12 mx-auto mb-3 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
              <h2 className="text-3xl font-bold text-slate-800 mb-2">{youTubeSectionTitle}</h2>
              {youTubeSectionDesc && <p className="text-slate-600 max-w-2xl mx-auto">{youTubeSectionDesc}</p>}
            </div>
            <div className="aspect-video max-w-3xl mx-auto bg-slate-200 rounded-lg shadow-xl overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={finalYouTubeEmbedUrl}
                title={youTubeSectionTitle || "University YouTube Video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            {youTubeChannelUrl && youTubeButtonText && (
              <div className="text-center mt-8">
                <a href={youTubeChannelUrl} target="_blank" rel="noopener noreferrer">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className={`${getButtonBgColor()} ${getButtonTextColor()} ${getButtonHoverBgColor()}`}
                    style={primaryColor.startsWith('#') ? {backgroundColor: primaryColor} : {}}
                  >
                    {youTubeButtonText} <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
                  </Button>
                </a>
              </div>
            )}
          </div>
        </section>
      )}


      {/* Call to Action for News/Events */}
      <section className={`py-16 sm:py-20 ${primaryColor.startsWith('#') ? 'bg-slate-700' : ('bg-' + primaryColor.split('-')[0] + '-700') }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <NewspaperIcon className="h-16 w-16 mx-auto mb-4 text-white opacity-90"/>
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-lg text-white opacity-80 mb-8 max-w-xl mx-auto">
            Follow our latest news, events, and announcements to stay connected with the {appName} community.
          </p>
          <Button variant="secondary" size="lg" onClick={() => alert('News & Events page coming soon!')} className="bg-white !text-slate-700 hover:!bg-slate-200">
            View News & Events
          </Button>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4">
            <p className="font-semibold text-lg text-white">{appName}</p>
            <p className="text-sm">{collegeAddress}</p>
            <p className="text-sm">
              Tel: <a href={formatTelLink(collegePhone)} className="hover:text-white transition-colors">{collegePhone}</a>
            </p>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-4 mb-4">
            {collegeWhatsApp && (
              <a
                href={`https://wa.me/${collegeWhatsApp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Chat with us on WhatsApp"
              >
                <WhatsAppIcon className="h-6 w-6" />
              </a>
            )}
            {facebookPageUrl && (
              <a
                href={facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Visit our Facebook page"
              >
                <FacebookIcon className="h-6 w-6" />
              </a>
            )}
            {/* Add other social icons here as needed */}
          </div>

          <div className="mb-4 flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
              {publicNavLinks.map(link => (
                <Link key={`footer-${link.name}`} to={link.path} className="hover:text-white text-sm">
                  {link.name}
                </Link>
              ))}
          </div>
          <p className="text-xs">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
        </div>
      </footer>

      {/* Facebook Messenger Chat Plugin */}
      {facebookPageId && facebookPageId !== "1234567890" && ( 
        <div
          id="fb-customer-chat"
          className="fb-customerchat"
          // data-page_id will be set in useEffect after component mounts to ensure div exists
          data-attribution="biz_inbox"
          // data-theme_color will be set in useEffect
          data-greeting_dialog_display="fade"
          data-minimized="true" 
        ></div>
      )}
      
      {/* WhatsApp Floating Action Button (Existing) */}
      {collegeWhatsApp && collegeWhatsApp.trim() !== "" && (
        <a
          href={`https://wa.me/${collegeWhatsApp.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(appName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 left-5 z-50 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
          aria-label="Chat on WhatsApp (Floating)"
        >
          <WhatsAppIcon className="w-7 h-7" />
        </a>
      )}

    </div>
  );
};

export default PublicHomePage;
