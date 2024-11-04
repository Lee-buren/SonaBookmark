import type { FormEventHandler, PropsWithChildren } from 'react';
import { forwardRef } from 'react';

interface IProps {
  name?: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const Form = forwardRef<HTMLFormElement, PropsWithChildren<IProps>>(({ name, onSubmit, children }, ref) => {
  return (
    <form ref={ ref } name={ name } className='sona-form' onSubmit={ onSubmit }>
      { children }
    </form>
  );
});

export default Form;