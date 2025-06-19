
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  actions?: React.ReactNode; 
  actionsClassName?: string;
  titleColor?: string; // e.g. 'text-red-500' or '#FF0000'
}

const Card: React.FC<CardProps> = ({ title, children, className, titleClassName, bodyClassName, actions, actionsClassName, titleColor }) => {
  const dynamicTitleStyle = titleColor?.startsWith('#') ? { color: titleColor } : {};
  const dynamicTitleClass = titleColor?.startsWith('#') ? '' : titleColor || 'text-gray-800';

  return (
    <div className={`bg-white shadow-lg rounded-xl overflow-hidden ${className || ''}`}>
      {title && (
        <div className={`p-5 border-b border-gray-200 ${titleClassName || ''}`}>
          <h3 className={`text-lg font-semibold ${dynamicTitleClass}`} style={dynamicTitleStyle}>{title}</h3>
        </div>
      )}
      <div className={`p-5 ${bodyClassName || ''}`}>
        {children}
      </div>
      {actions && (
        <div className={`p-5 border-t border-gray-200 bg-gray-50 ${actionsClassName || ''}`}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card;
