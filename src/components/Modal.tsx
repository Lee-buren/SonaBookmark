import { type CSSProperties, type ReactNode, useContext, useEffect, useState } from 'react';
import Closed from 'react:../../assets/Closed.svg';
import { ConfigContext } from '~components/ConfigProvider';

interface Props {
  top?: number;
  title: string;
  open: boolean;
  saveText?: string;
  cancelText?: string;
  onSave: () => void;
  onCancel: () => void;
  readonly extraButtons?: ReactNode[];
  readonly formItems: ReactNode[];
}

const Modal = (props: Props) => {
  const { top = 0, title, open, saveText, cancelText, onSave, onCancel, extraButtons = [], formItems = [] } = props;
  const { config } = useContext(ConfigContext);
  const [ openStyle, setOpenStyle ] = useState<CSSProperties>();
  useEffect(() => {
    if (open) {
      // height = header 28px, footer 28px, content pt 8px, formitem 44px
      const height = 64 + 44 * formItems.filter(Boolean).length;
      const maxTop = innerHeight - height;
      const Y = maxTop < top ? maxTop : top;
      const X = config.position === 'right' ? '-180' : config.width;
      setOpenStyle({ height, opacity: 1, transform: `translate(${ X }px, ${ Y }px)` });
    } else {
      setOpenStyle({ ...openStyle, height: 0, opacity: 0 });
    }
  }, [ open, top, formItems, config.position, config.width ]);
  return (
    <div className='sona-bookmark-modal' style={ openStyle }>
      <div className='sona-bookmark-modal-header'>
        <div>{ title }</div>
        <div className='sona-bookmark-svg' title='关闭' onClick={ onCancel }>
          <Closed />
        </div>
      </div>
      <form className='sona-bookmark-modal-content'>
        { formItems.filter(Boolean).map((item, index) => (<label key={ index }>{ item }</label>)) }
      </form>
      <div className='sona-bookmark-modal-footer'>
        { ...extraButtons }
        <button onClick={ onCancel }>{ cancelText || '取消' }</button>
        <button onClick={ onSave }>{ saveText || '保存' }</button>
      </div>
    </div>
  );
};

export default Modal;
