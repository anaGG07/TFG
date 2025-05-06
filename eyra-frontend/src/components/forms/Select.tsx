import { SelectHTMLAttributes, forwardRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  helperText,
  fullWidth = false,
  size = 'md',
  className = '',
  disabled,
  ...props
}, ref) => {
  const hasError = !!error;
  
  const sizeClasses = {
    sm: 'py-1.5 text-xs',
    md: 'py-2 text-sm',
    lg: 'py-3 text-base',
  };
  
  const selectClasses = `
    block rounded-md border-gray-300 shadow-sm
    focus:border-primary-500 focus:ring-primary-400
    ${sizeClasses[size]}
    ${hasError ? 'border-accent-500 text-accent-700 focus:border-accent-500 focus:ring-accent-500' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
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
      
      <select
        ref={ref}
        disabled={disabled}
        className={selectClasses}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${props.id}-error` : undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
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

Select.displayName = 'Select';
