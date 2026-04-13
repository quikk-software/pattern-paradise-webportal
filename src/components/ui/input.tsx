import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeClosed } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const isPasswordType = type === 'password';

    return (
      <div className="relative w-full">
        <input
          type={isPasswordType && showPassword ? 'text' : type}
          className={cn(
            'flex h-14 w-full rounded-full border-0 bg-muted px-6 py-2 text-base text-foreground shadow-clay-pressed ring-offset-background transition-all duration-300',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
            'placeholder:text-muted-foreground',
            'focus:bg-card focus:ring-4 focus:ring-primary/25 focus:shadow-clay-card focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-5 flex items-center text-muted-foreground hover:text-foreground focus:outline-none transition-colors duration-300"
          >
            {showPassword ? <Eye className="h-5 w-5" /> : <EyeClosed className="h-5 w-5" />}
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
