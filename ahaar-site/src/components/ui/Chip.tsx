import { HTMLAttributes } from 'react';

export function Chip({ className = '', children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.78rem] font-medium border border-ink/15 bg-bg text-ink ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
