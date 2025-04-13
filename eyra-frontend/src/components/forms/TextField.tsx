import { InputHTMLAttributes, forwardRef } from 'react';
import { Input } from '../ui/Input';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  return <Input ref={ref} {...props} />;
});

TextField.displayName = 'TextField';
