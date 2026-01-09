import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon, action }) => {
  return (
    <div className={`glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${className}`}>
      {(title || icon) && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-full bg-cobalt/10 flex items-center justify-center text-cobalt">
                <i className={`${icon} text-lg`}></i>
              </div>
            )}
            {title && <h3 className="text-xl font-semibold text-gray-800">{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="text-gray-600">
        {children}
      </div>
    </div>
  );
};