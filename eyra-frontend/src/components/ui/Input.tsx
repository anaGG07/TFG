import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  leftIcon,
  rightIcon,
  disabled,
  ...props
}, ref) => {
  const hasError = !!error;
  
  const inputWrapperClasses = `
    relative rounded-md shadow-sm
    ${fullWidth ? 'w-full' : ''}
  `;
  
  const inputClasses = `
    block rounded-md border-gray-300 shadow-sm
    focus:border-primary-500 focus:ring-primary-400 sm:text-sm
    ${hasError ? 'border-accent-500 text-accent-700 placeholder-accent-300 focus:border-accent-500 focus:ring-accent-500' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white/80">
          {label}
        </label>
      )}
      
      <div className={inputWrapperClasses}>
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.id}-error` : undefined}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p 
          className={`mt-1 text-sm ${hasError ? 'text-accent-600' : 'text-gray-500 dark:text-gray-400'}`}
          id={hasError ? `${props.id}-error` : undefined}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
