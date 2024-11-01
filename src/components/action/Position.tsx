import { useContext } from 'react';
import ToLeft from 'react:assets/ToLeft.svg';
import ToRight from 'react:assets/ToRight.svg';
import { ConfigContext } from '~components/ConfigProvider';

const Position = () => {
  const { config, setConfig } = useContext(ConfigContext);
  const onRight = config.position === 'right';

  const positionToggle = () => {
    setConfig({ position: onRight ? 'left' : 'right', isAffixed: true });
  };

  return (
    <div className='sona-svg' title='切换左/右栏' onClick={ positionToggle }>
      { onRight ? <ToLeft /> : <ToRight /> }
    </div>
  );
};

export default Position;