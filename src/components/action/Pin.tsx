import { useContext } from 'react';
import PinIcon from 'react:assets/Pin.svg';
import PinOffIcon from 'react:assets/PinOff.svg';
import { ConfigContext } from '~components/ConfigProvider';

const Pin = () => {
  const { config, setConfig } = useContext(ConfigContext);

  const affixedToggle = () => {
    setConfig({ isAffixed: !config.isAffixed });
  };

  return (
    <div className='sona-svg' title='固定' onClick={ affixedToggle }>
      { config.isAffixed ? <PinIcon /> : <PinOffIcon /> }
    </div>
  );
};

export default Pin;