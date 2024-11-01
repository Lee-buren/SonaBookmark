import { memo, useContext } from 'react';
import Mode from '~components/action/Mode';
import Pin from '~components/action/Pin';
import Position from '~components/action/Position';
import Setting from '~components/action/Setting';
import { ConfigContext } from '~components/ConfigProvider';
import SettingModal from '~components/modal/SettingModal';

const Header = () => {
  const { config } = useContext(ConfigContext);
  return (
    <>
      <div className={ `sona-header ${ config.position }` }>
        <div className='sona-header__actions'>
          <Pin />
          <Mode />
          <Position />
        </div>
        <Setting />
      </div>

      <SettingModal />
    </>
  );
};

export default memo(Header);