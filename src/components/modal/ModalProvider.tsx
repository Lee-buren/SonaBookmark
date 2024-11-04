import { useEventListener } from 'ahooks';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useState } from 'react';

type ModalType = '' | 'Setting' | 'Handle'

interface IModalContext {
  modal: ModalType;
  setModal: Setter<ModalType>;
}

export const ModalContext = createContext<IModalContext>(null);

const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ modalName, setModalName ] = useState<ModalType>('');

  const setModal = (modal: ModalType) => {
    if (modal && modal === modalName) {
      setModalName('');
      setTimeout(() => {
        setModalName(modal);
      }, 158);
    } else {
      setModalName(modal);
    }
  };

  useEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (modalName === '' || target.id === 'sona-bookmark') return;
    setModalName('');
  });

  return (
    <ModalContext.Provider value={ { modal: modalName, setModal } }>
      { children }
    </ModalContext.Provider>
  );
};

export default ModalProvider;