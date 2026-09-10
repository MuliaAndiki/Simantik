'use client';

import { Icon } from '@iconify/react';
import * as React from 'react';

import { Button, Input } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface NotifyMeFormProps extends React.HTMLAttributes<HTMLFormElement> {
  onSubscribe?: (email: string) => Promise<void> | void;
  placeholder?: string;
  buttonText?: string;
}

export function NotifyMeForm({
  onSubscribe,
  placeholder = 'Masukkan alamat email Anda...',
  buttonText = 'Beri Tahu Saya',
  className,
  ...props
}: NotifyMeFormProps) {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Mohon masukkan format email yang valid.');
      return;
    }

    try {
      setLoading(true);
      if (onSubscribe) {
        await onSubscribe(email);
      } else {
        // Fallback simulated asynchronous waitlist registration
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setSubmitted(true);
    } catch {
      setError('Terjadi kendala saat mendaftarkan email. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className={cn(
          'flex items-center justify-center gap-3 p-4 rounded-2xl bg-[#E0F7FA] border border-[#8BBCC5]/40 text-[#1A4D5C] animate-enter',
          className
        )}
      >
        <div className="flex items-center justify-center size-8 rounded-full bg-[#4CA7B1] text-white shrink-0">
          <Icon icon="lucide:check" className="size-5" />
        </div>
        <div className="text-left">
          <p className="font-bold text-sm">Terima kasih telah bergabung!</p>
          <p className="text-xs text-[#546A72]">
            Kami akan mengirimkan pemberitahuan eksklusif saat platform resmi diluncurkan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto', className)}
      {...props}
    >
      <div className="flex-1 flex flex-col gap-1.5 text-left">
        <div className="relative">
          <Icon
            icon="lucide:mail"
            className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8BBCC5] pointer-events-none"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder={placeholder}
            disabled={loading}
            className="h-12 pl-12 pr-4 bg-white border-[#E5E7EB] rounded-2xl text-sm focus-visible:border-[#4CA7B1] focus-visible:ring-[#F7CE46] text-[#111827] placeholder:text-[#546A72]"
            aria-invalid={Boolean(error)}
          />
        </div>
        {error && <span className="text-xs font-medium text-[#DC2626] pl-2">{error}</span>}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-12 px-6 rounded-full bg-[#F7CE46] text-[#1A4D5C] hover:bg-[#4CA7B1] hover:text-white font-bold text-sm shrink-0 shadow-md shadow-[#F7CE46]/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
      >
        {loading ? (
          <Icon icon="lucide:loader-2" className="size-5 animate-spin" />
        ) : (
          <>
            <span>{buttonText}</span>
            <Icon icon="lucide:arrow-right" className="size-4 ml-1" />
          </>
        )}
      </Button>
    </form>
  );
}
