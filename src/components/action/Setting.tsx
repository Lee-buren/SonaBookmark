import { useContext } from 'react';
import SettingIcon from 'react:assets/Setting.svg';
import { ConfigContext } from '~components/ConfigProvider';
import { ModalContext } from '~components/modal/ModalProvider';
import SettingModal from '~components/modal/SettingModal';

const Setting = () => {
  const { setConfig } = useContext(ConfigContext);
  const { setModal } = useContext(ModalContext);

  const settingClick = () => {
    setConfig({ isFixed: true });
    setModal((prev) => prev === 'Setting' ? '' : 'Setting');
  };
  return (
    <>
      <div className='sona-svg' title='设置' onClick={ settingClick }>
        <SettingIcon />
      </div>

      <SettingModal />
    </>
  );
};

export default Setting;