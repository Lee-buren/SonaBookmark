import { forwardRef } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface IProps extends UseFormRegisterReturn {
  defaultValue?: string;
  options: { label: string, value: string }[];
}

const Radio = forwardRef<HTMLInputElement, IProps>(({ defaultValue, options, ...props }, ref) => {
  return (
    <div className='sona-radio-group'>
      { options.map((option, index) => (
        <label key={ index } className='sona-radio-item'>
          <input
            className='sona-radio-input'
            ref={ ref }
            type='radio'
            value={ option.value }
            defaultChecked={ option.value === defaultValue }
            { ...props } />
          <span className='sona-radio-label'>{ option.label }</span>
        </label>
      )) }
    </div>
  );
});

export default Radio;