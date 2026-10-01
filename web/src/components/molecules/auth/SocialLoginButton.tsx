import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { cn } from '@/utils/classname';

export interface SocialLoginButtonProps extends React.ComponentProps<typeof Button> {
  provider: 'google';
}

export function SocialLoginButton({
  provider,
  className,
  children,
  ...props
}: SocialLoginButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        'w-full h-11 sm:h-12 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white text-slate-700 text-sm font-medium flex items-center justify-center gap-2.5 transition-all shadow-2xs',
        className
      )}
      {...props}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="Google">
        <title>Google</title>
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          fill="currentColor"
        />
      </svg>
      <span>{children || 'Login dengan Google'}</span>
    </Button>
  );
}
