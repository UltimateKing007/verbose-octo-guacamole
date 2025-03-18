import React, { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  label,
  error,
  helperText,
  className = '',
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2';
  const validClasses = 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20';
  const errorClasses = 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20';
  const disabledClasses = 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed';

  return (
    <div className={className}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={`
            ${baseClasses}
            ${error ? errorClasses : validClasses}
            ${disabled ? disabledClasses : ''}
          `}
          disabled={disabled}
          required={required}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
