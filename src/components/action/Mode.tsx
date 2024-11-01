import { useContext } from 'react';
import Moon from 'react:assets/Moon.svg';
import Sun from 'react:assets/Sun.svg';
import { ConfigContext } from '~components/ConfigProvider';

const Mode = () => {
  const { config, setConfig } = useContext(ConfigContext);
  const isDark = config.mode === 'dark';

  const modeToggle = () => {
    setConfig({ mode: isDark ? 'light' : 'dark' });
  };

  return (
    <div className='sona-svg' title='显示模式' onClick={ modeToggle }>
      { isDark ? <Moon /> : <Sun /> }
    </div>
  );
};

export default Mode;