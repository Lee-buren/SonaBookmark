import type { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import { forwardRef, memo, useContext, useMemo } from 'react';
import Closed from 'react:assets/Closed.svg';
import { ConfigContext } from '~components/ConfigProvider';

interface IProps {
  title: string;
  open: boolean;
  header?: ReactNode;
  style?: CSSProperties;
  onClose: () => void;
}

const Modal = forwardRef<HTMLDivElement, PropsWithChildren<IProps>>((props, ref) => {
  const { title, open, header, style, onClose, children } = props;
  const { config } = useContext(ConfigContext);

  const openStyle = useMemo(() => {
    const { width, position } = config;
    const prefix = position === 'right' ? '-' : '';
    const borderName = `border${ position.charAt(0).toUpperCase() + position.slice(1) }`;

    return {
      opacity: +open,
      clipPath: `inset(${ open ? '-4px' : '50%' })`,
      boxShadow: `${ prefix }2px 2px 3px var(--sona-shadow)`,
      [position]: `${ width }px`,
      [borderName]: '1px solid var(--sona-hover)',
    };
  }, [ open, config.width, config.position ]);

  return (
    <div ref={ ref } className='sona-modal' style={ { ...style, ...openStyle } }>
      { header !== undefined ? header :
        <div className='sona-modal__header'>
          <div>{ title }</div>
          <div className='sona-svg' title='关闭' onClick={ onClose }>
            <Closed />
          </div>
        </div> }
      { children }
    </div>
  );
});

export default memo(Modal);
