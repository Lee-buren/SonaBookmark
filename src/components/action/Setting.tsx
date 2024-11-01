import { memo, useContext } from 'react';
import SettingIcon from 'react:assets/Setting.svg';
import { ModalContext } from '~components/modal/ModalProvider';

const Setting = () => {
  const { modal, setModal } = useContext(ModalContext);

  const settingClick = () => {
    setModal(modal === 'Setting' ? '' : 'Setting');
  };
  return (
    <div className='sona-svg' title='设置' onClick={ settingClick }>
      <SettingIcon />
    </div>
  );
};

export default memo(Setting);