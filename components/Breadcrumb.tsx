
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  primaryColor?: string; // e.g. sky-600 or #HEXCODE
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className, primaryColor = 'sky-600' }) => {
  if (!items || items.length === 0) {
    return null;
  }

  const getLinkColorClass = () => {
    if (primaryColor.startsWith('#')) return '';
    const [color, shade = '600'] = primaryColor.split('-');
    return `hover:text-${color}-${Math.min(900, parseInt(shade, 10) + 100)}`;
  };
  
  const getLinkColorStyle = (): React.CSSProperties => {
    if (primaryColor.startsWith('#')) return { color: primaryColor };
    return {};
  };


  return (
    <nav className={`flex ${className || ''}`} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        <li>
          <div>
            <Link to="/" className="text-slate-400 hover:text-slate-500">
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {items.map((item, index) => (
          <li key={item.name}>
            <div className="flex items-center">
              <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
              {item.path ? (
                <Link
                  to={item.path}
                  className={`ml-2 text-sm font-medium text-slate-500 ${primaryColor.startsWith('#') ? '' : getLinkColorClass()}`}
                  style={primaryColor.startsWith('#') ? getLinkColorStyle() : {}}
                  onMouseEnter={e => primaryColor.startsWith('#') && (e.currentTarget.style.color = primaryColor) }
                  onMouseLeave={e => primaryColor.startsWith('#') && (e.currentTarget.style.color = '')}
                  aria-current={index === items.length - 1 ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ) : (
                <span className="ml-2 text-sm font-medium text-slate-700" aria-current="page">
                  {item.name}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;