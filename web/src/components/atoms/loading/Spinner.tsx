import { Loader2 } from 'lucide-react';
import type React from 'react';
import { cn } from '@/utils/classname';

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses: Record<NonNullable<SpinnerProps['size']>, string> = {
  xs: 'size-3',
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
  xl: 'size-6',
};

export function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin shrink-0 text-current', sizeClasses[size], className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export default Spinner;
