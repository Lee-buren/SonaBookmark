import { forwardRef } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface IProps extends UseFormRegisterReturn {
  defaultValue?: string | number;
  placeholder?: string;
  step?: number;
}

const InputNumber = forwardRef<HTMLInputElement, IProps>(({ defaultValue, placeholder, step = 1, ...props }, ref) => {
  return (
    <input
      ref={ ref }
      type='number'
      step={ step }
      defaultValue={ defaultValue }
      placeholder={ placeholder } { ...props } />
  );
});

export default InputNumber;