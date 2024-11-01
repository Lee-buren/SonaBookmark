import { forwardRef } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface IProps extends UseFormRegisterReturn {
  defaultValue?: string;
}

const Input = forwardRef<HTMLInputElement, IProps>(({ defaultValue, ...props }, ref) => {
  return (
    <input ref={ ref } type='text' defaultValue={ defaultValue } { ...props } />
  );
});

export default Input;