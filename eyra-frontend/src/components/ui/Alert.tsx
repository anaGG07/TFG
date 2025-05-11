import { ReactNode } from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  title?: string;
  icon?: ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert = ({
  children,
  variant = 'info',
  title,
  icon,
  onClose,
  className = '',
}: AlertProps) => {
  // Variant-specific styles - EYRA CLUB colors en formato plano
  const variantStyles = {
    info: {
      container: 'bg-[#f5dfc4;] border-[#FF6C5C] text-[#C62328]',
      icon: 'text-[#FF6C5C]',
      closeButton: 'text-[#FF6C5C] hover:text-[#B5413A]',
    },
    success: {
      container: 'bg-green-50 border-green-400 text-green-800',
      icon: 'text-green-500',
      closeButton: 'text-green-500 hover:text-green-700',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-400 text-yellow-800',
      icon: 'text-yellow-500',
      closeButton: 'text-yellow-500 hover:text-yellow-700',
    },
    error: {
      container: 'bg-[#feebeb] border-[#C62328] text-[#9f1239]',
      icon: 'text-[#C62328]',
      closeButton: 'text-[#C62328] hover:text-[#9f1239]',
    },
  };

  // Default icons for each variant
  const defaultIcons = {
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  };

  const styles = variantStyles[variant];
  const displayIcon = icon || defaultIcons[variant];

  return (
    <div className={`border-l-4 p-4 rounded-md ${styles.container} ${className}`} role="alert">
      <div className="flex">
        {displayIcon && (
          <div className={`flex-shrink-0 mr-3 ${styles.icon}`}>
            {displayIcon}
          </div>
        )}
        
        <div className="flex-1">
          {title && <div className="font-medium">{title}</div>}
          <div className={title ? 'mt-1' : ''}>{children}</div>
        </div>
        
        {onClose && (
          <div className="flex-shrink-0 ml-4">
            <button
              type="button"
              className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.closeButton}`}
              onClick={onClose}
              aria-label="Close"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
