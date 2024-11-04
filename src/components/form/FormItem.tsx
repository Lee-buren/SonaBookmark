import type { FC, PropsWithChildren } from 'react';
import type { FieldError } from 'react-hook-form';

interface IProps {
  className?: string;
  label: string;
  errors?: FieldError;
}

const FormItem: FC<PropsWithChildren<IProps>> = ({ className = '', label, errors, children }) => {
  return (
    <div className={ 'sona-form__item ' + className }>
      <div>{ label }</div>
      { children }
      <div className='sona-form__item_error'>{ errors?.message }</div>
    </div>
  );
};

export default FormItem;