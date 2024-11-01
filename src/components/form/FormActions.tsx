import type { FC, PropsWithChildren } from 'react';

const FormActions: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='sona-form__actions'>
      { children }
    </div>
  );
};

export default FormActions;