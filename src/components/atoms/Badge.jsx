import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center rounded-full font-medium transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-blue-100 text-primary",
    success: "bg-gradient-to-r from-success/10 to-green-100 text-success",
    warning: "bg-gradient-to-r from-warning/10 to-yellow-100 text-warning",
    error: "bg-gradient-to-r from-error/10 to-red-100 text-error",
    info: "bg-gradient-to-r from-info/10 to-blue-100 text-info"
  };

  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;