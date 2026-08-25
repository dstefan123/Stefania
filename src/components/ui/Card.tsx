import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hover && 'transition-all duration-200 hover:shadow-md hover:border-ink-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
