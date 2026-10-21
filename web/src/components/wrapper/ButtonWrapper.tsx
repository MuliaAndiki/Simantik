import * as React from 'react';
import { Button, type ButtonProps, Spinner } from '../atoms';

export interface ActionButtonProps extends ButtonProps {
  isPending?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ children, isPending = false, iconLeft, iconRight, disabled, ...props }, ref) => {
    return (
      <Button ref={ref} disabled={isPending || disabled} {...props}>
        {isPending ? <Spinner size="sm" /> : iconLeft}

        {children}

        {!isPending && iconRight}
      </Button>
    );
  }
);

ActionButton.displayName = 'ActionButton';

export { ActionButton };
