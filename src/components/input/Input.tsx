import { forwardRef } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface IProps extends UseFormRegisterReturn {
  defaultValue?: string;
  placeholder?: string;
}

const Input = forwardRef<HTMLInputElement, IProps>(({ defaultValue, placeholder, ...props }, ref) => {
  return (
    <input ref={ ref } type='text' defaultValue={ defaultValue } placeholder={ placeholder } { ...props } />
  );
});

export default Input;