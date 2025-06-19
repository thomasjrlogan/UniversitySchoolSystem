
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Page, AppSettings } from '../types';
import { NAV_ITEMS, DEFAULT_APP_SETTINGS } from '../constants';
import { 
    ArrowLeftOnRectangleIcon, 
    ChevronDownIcon, 
    UserCircleIcon as ProfileIconSolid, 
    Cog6ToothIcon as SettingsIconSolid, 
    ChatBubbleBottomCenterTextIcon as ComplainIconSolid, 
    CalendarDaysIcon as LeaveIconSolid,
    IdentificationIcon as MyProfileIconSolid
} from '@heroicons/react/20/solid'; // Using solid icons for dropdown

interface HeaderProps {
  onLogout: () => void;
  appSettings: AppSettings;
}

const Header: React.FC<HeaderProps> = ({ onLogout, appSettings }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const primaryColor = appSettings.primaryColor || DEFAULT_APP_SETTINGS.primaryColor || 'sky-500';
  const headingTextColor = appSettings.headingTextColor || DEFAULT_APP_SETTINGS.headingTextColor || 'text-slate-700';
  
  let pageTitle: Page | string = Page.Dashboard; 

  const currentNavItem = NAV_ITEMS.find(item => {
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  });

  if (currentNavItem) {
    pageTitle = currentNavItem.name;
  } else if (location.pathname === '/login') {
    pageTitle = 'Login'; 
  } else if (location.pathname.startsWith('/admin/profile')) {
    pageTitle = Page.AdminProfile;
  }

  const avatarBgClass = primaryColor.startsWith("#") ? '' : `bg-${primaryColor}`;
  const avatarStyle = primaryColor.startsWith("#") ? { backgroundColor: primaryColor } : {};

  const headingStyle = headingTextColor.startsWith('#') ? { color: headingTextColor } : {};
  const headingClass = headingTextColor.startsWith('#') ? '' : headingTextColor;

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickLinkAction = (action: () => void) => {
    action();
    setIsDropdownOpen(false);
  };

  const quickLinks = [
    { name: 'My Profile', icon: <MyProfileIconSolid className="h-5 w-5 mr-2" />, action: () => navigate('/admin/profile') },
    { name: 'Change Password', icon: <SettingsIconSolid className="h-5 w-5 mr-2" />, action: () => navigate('/admin/settings') }, // Points to settings page for password
    { name: 'Complain', icon: <ComplainIconSolid className="h-5 w-5 mr-2" />, action: () => alert('Complain feature coming soon!') },
    { name: 'Leave Application', icon: <LeaveIconSolid className="h-5 w-5 mr-2" />, action: () => alert('Leave Application feature coming soon!') },
    { name: 'Log Out', icon: <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />, action: onLogout },
  ];

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-30 print:hidden">
      <div className="container mx-auto flex justify-between items-center">
        <h2 className={`text-2xl font-semibold ${headingClass}`} style={headingStyle}>{pageTitle}</h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <div 
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold border-2 border-white shadow-sm ${avatarBgClass}`}
              style={avatarStyle}
              aria-label="Admin menu"
            >
              {appSettings.adminUsername ? appSettings.adminUsername.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="text-sm text-slate-600 hidden md:block">
              {appSettings.adminUsername || 'Admin'}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''} hidden md:block`} />
          </button>
          
          {isDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-40 py-1 ring-1 ring-black ring-opacity-5 origin-top-right"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
            >
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-slate-800 truncate">{appSettings.adminUsername || 'Admin'}</p>
                <p className="text-xs text-slate-500 truncate">{appSettings.adminEmail || 'No email set'}</p>
              </div>
              {quickLinks.map(link => (
                <button
                  key={link.name}
                  onClick={() => handleQuickLinkAction(link.action)}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  role="menuitem"
                >
                  {link.icon}
                  {link.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;