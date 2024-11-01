import type { FC, PropsWithChildren } from 'react';
import type { FieldError } from 'react-hook-form';

interface IProps {
  label: string;
  errors?: FieldError;
}

const FormItem: FC<PropsWithChildren<IProps>> = ({ label, errors, children }) => {
  return (
    <div className='sona-form__item'>
      <div>{ label }</div>
      { children }
      <div className='sona-form__item_error'>{ errors?.message }</div>
    </div>
  );
};

export default FormItem;