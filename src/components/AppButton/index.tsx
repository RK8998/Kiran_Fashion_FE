import React from 'react';
import { Button, ButtonProps } from '@heroui/button';

interface AppButtonProps extends Omit<ButtonProps, 'children' | 'onPress'> {
  /** Text content of the button */
  title?: string;
  /** Click handler */
  onClick?: () => void;
  /** Optional start icon */
  startIcon?: React.ReactNode;
  /** Optional end icon */
  endIcon?: React.ReactNode;
}

/**
 * A reusable Button component that wraps HeroUI Button with sensible defaults.
 */
const AppButton: React.FC<AppButtonProps> = ({
  title = 'Button',
  onClick,
  startIcon,
  endIcon,
  color = 'primary',
  radius = 'full',
  size = 'md',
  variant = 'solid',
  isDisabled = false,
  isLoading = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <Button
      className={`relative font-medium transition-all duration-300
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
                  active:scale-95
                  ${className}`}
      color={color}
      endContent={endIcon}
      fullWidth={fullWidth}
      isDisabled={isDisabled}
      isLoading={isLoading}
      radius={radius}
      size={size}
      startContent={startIcon}
      variant={variant}
      onPress={onClick}
      {...props}
    >
      {title}
    </Button>
  );
};

export default AppButton;
