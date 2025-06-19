
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS, DEFAULT_APP_SETTINGS } from '../constants';
import { AppSettings, Page } from '../types';
import { AcademicCapIcon, PhoneArrowUpRightIcon } from '@heroicons/react/24/outline'; 

interface SideNavbarProps {
  appSettings: AppSettings;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ appSettings }) => {
  const location = useLocation();
  const { appName, collegeAddress, collegePhone, collegeLogo, collegeWhatsApp } = appSettings;
  const primaryColor = appSettings.primaryColor || DEFAULT_APP_SETTINGS.primaryColor || 'sky-600';
  const appNameColor = appSettings.primaryColor ? appSettings.primaryColor.replace('-600', '-400').replace('-500', '-400') : 'sky-400'; // Adjust shade for text

  const formatWhatsAppLink = (number?: string) => {
    if (!number) return '#';
    const cleaned = number.replace(/\D/g, ''); // Remove non-digits
    return `https://wa.me/${cleaned}`;
  };

  const formatTelLink = (phone?: string) => {
    if (!phone) return '#';
    return `tel:${phone.replace(/\D/g, '')}`;
  };
  
  // Helper to generate hover color, simple version
  const getHoverBgClass = (color: string) => {
    if(color.startsWith('#')) return `hover:brightness-90`; // Simple hover for hex
    const parts = color.split('-');
    if (parts.length === 2) {
      const shade = parseInt(parts[1]);
      if (!isNaN(shade) && shade >= 200) return `hover:bg-${parts[0]}-${Math.max(100, shade - 100)}`; // e.g. sky-700 for sky-600
      return `hover:bg-${parts[0]}-700`; // default hover
    }
    return `hover:bg-slate-700`; // fallback
  }
  const activeBgClass = primaryColor.startsWith("#") ? '' : `bg-${primaryColor}`;
  const activeStyle = primaryColor.startsWith("#") ? { backgroundColor: primaryColor } : {};


  return (
    <div className="w-72 h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col shadow-xl print:hidden">
      <div className="p-6 border-b border-slate-700 flex items-center space-x-3">
        {collegeLogo ? (
            <img src={collegeLogo} alt={`${appName} Logo`} className="h-12 w-12 object-contain rounded-md" />
        ) : (
            <AcademicCapIcon className={`h-10 w-10 text-${appNameColor} flex-shrink-0`} />
        )}
        <div>
            <h1 className={`text-xl font-semibold tracking-tight text-${appNameColor}`}>{appName}</h1>
            <p className="text-xs text-slate-400 leading-tight">{collegeAddress}</p>
            {collegePhone && (
              <p className="text-xs text-slate-400">
                Tel: <a href={formatTelLink(collegePhone)} className="hover:text-sky-300">{collegePhone}</a>
              </p>
            )}
            {collegeWhatsApp && (
                 <a 
                    href={formatWhatsAppLink(collegeWhatsApp)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-green-400 hover:text-green-300 flex items-center mt-0.5"
                    aria-label={`Chat with us on WhatsApp: ${collegeWhatsApp}`}
                >
                    <PhoneArrowUpRightIcon className="h-3 w-3 mr-1"/> WhatsApp
                 </a>
            )}
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/');
          
          return (
            <Link
              key={item.name}
              to={item.path}
              style={isActive ? activeStyle : {}}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group
                ${isActive
                  ? `${activeBgClass} text-white shadow-md transform scale-105`
                  : `text-slate-300 ${getHoverBgClass(primaryColor)} hover:text-${appNameColor}` // Use appNameColor for hover text to match theme
                }`}
            >
              <span className={`${isActive ? 'text-white' : `text-slate-400 group-hover:text-${appNameColor}`}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mt-auto border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">&copy; {new Date().getFullYear()} {appName}</p>
      </div>
    </div>
  );
};

export default SideNavbar;
