import { HTMLAttributes } from 'react';

export function Pill({ className = '', children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.78rem] tracking-wide uppercase bg-surface text-muted border border-ink/10 ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
