import { ButtonHTMLAttributes, forwardRef } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'solid' };

// Pill, 1px ink outline, turmeric fill on hover; honours 44px minimum touch target.
export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'outline', className = '', children, ...rest }, ref) => {
    const base =
      'inline-flex items-center justify-center min-h-[44px] px-6 py-2 rounded-full font-sans text-[0.95rem] font-medium transition-colors duration-500 ease-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent';
    const styles =
      variant === 'solid'
        ? 'bg-ink text-bg hover:bg-accent hover:text-ink'
        : 'border border-ink/80 text-ink hover:bg-accent hover:border-accent';
    return (
      <button ref={ref} className={`${base} ${styles} ${className}`} {...rest}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
