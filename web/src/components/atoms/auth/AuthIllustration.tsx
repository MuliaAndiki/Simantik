import Image from 'next/image';
import type * as React from 'react';
import { cn } from '@/utils/classname';

export interface AuthIllustrationProps {
  className?: string;
  variant?: 'login' | 'register' | 'forgot-password';
}

export function AuthIllustration({ className }: AuthIllustrationProps) {
  return (
    <Image
      src="/images/auth-logos.png"
      alt="Ilustrasi Login"
      width={500}
      height={500}
      className={cn(className, className)}
    />
  );
}
