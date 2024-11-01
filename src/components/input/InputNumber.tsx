import { forwardRef } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface IProps extends UseFormRegisterReturn {
  defaultValue?: string;
}

const InputNumber = forwardRef<HTMLInputElement, IProps>(({ defaultValue, ...props }, ref) => {
  return (
    <input ref={ ref } type='number' defaultValue={ defaultValue } { ...props } />
  );
});

export default InputNumber;