import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { Spinner } from '@/components/atoms/loading/Spinner';
import { cn } from '@/utils/classname';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        activate: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        noActivate: 'bg-background text-foreground shadow-xs hover:bg-foreground/5',
        quit: 'bg-transparent text-destructive shadow-xs border border-destructive hover:bg-destructive/90 hover:text-white',
        google:
          'bg-background, text-foreground rounded-full font-light border shadow-2xl drop-shadow-2xl hover:bg-foreground/10 ',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loading?: boolean;
  loadingText?: React.ReactNode;
  spinnerPlacement?: 'start' | 'end';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loading = false,
      loadingText,
      spinnerPlacement = 'start',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isBusy = Boolean(isLoading || loading);
    const Comp = asChild ? Slot : 'button';
    const spinnerSize = size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm';

    return (
      <Comp
        ref={ref}
        data-slot="button"
        disabled={disabled || isBusy}
        aria-busy={isBusy}
        className={cn(buttonVariants({ variant, size, className }), isBusy && 'cursor-wait')}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {isBusy && spinnerPlacement === 'start' && <Spinner size={spinnerSize} />}
            {isBusy && loadingText !== undefined ? loadingText : children}
            {isBusy && spinnerPlacement === 'end' && <Spinner size={spinnerSize} />}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
