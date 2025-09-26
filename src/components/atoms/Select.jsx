import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({
  className,
  label,
  error,
  helperText,
  children,
  ...props
}, ref) => {
  const id = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          "w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-transparent bg-white",
          error 
            ? "border-error focus:ring-error" 
            : "border-gray-300 hover:border-gray-400",
          "disabled:bg-gray-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;