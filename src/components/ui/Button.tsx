import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'dark' | 'light' | 'ghost' | 'danger' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary: 'btn-primary',
  dark: 'btn-dark',
  light: 'btn-light',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  secondary: 'btn-light',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(variants[variant], className)} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
