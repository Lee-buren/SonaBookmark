import type { FormEventHandler, PropsWithChildren } from 'react';
import { forwardRef } from 'react';

interface IProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const Form = forwardRef<HTMLFormElement, PropsWithChildren<IProps>>(({ children, onSubmit }, ref) => {
  return (
    <form ref={ ref } className='sona-form' onSubmit={ onSubmit }>
      { children }
    </form>
  );
});

export default Form;