import { useEventListener } from 'ahooks';
import { createContext, type FC, type PropsWithChildren, useRef, useState } from 'react';

type ModalType = '' | 'Setting' | 'Handle'

interface IModalContext {
  modal: ModalType;
  setModal: Setter<ModalType>;
}

export const ModalContext = createContext<IModalContext>(null);

const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ modalName, setModalName ] = useState<ModalType>('');

  const timer = useRef<number>(null);
  const setModal = (modal: ModalType) => {
    if (modal && modal === modalName) {
      clearTimeout(timer.current);
      setModalName('');
      timer.current = setTimeout(() => {
        setModalName(modal);
        timer.current = null;
      }, 100);
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