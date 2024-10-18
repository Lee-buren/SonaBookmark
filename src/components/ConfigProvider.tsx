import { useStorage } from '@plasmohq/storage/dist/hook';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext } from 'react';

export const defaultConfig: Config = {
  width: 140,
  fontSize: 12,
  triggerWidth: 16,
  bookmarkHeight: 22,
  isAffixed: false,
  expandId: '',
  expandIds: [],
  target: '_blank',
  duration: 300,
  mode: 'light',
  position: 'left',
};

interface Context {
  config: Config;
  setConfig: Dispatch<SetStateAction<Config>>;
}

export const ConfigContext = createContext<Context>({
  config: defaultConfig,
  setConfig: (config: Config) => config,
});

const ConfigProvider = ({ children }: { readonly children: ReactNode; }) => {
  const [ config, setConfig ] = useStorage('config', defaultConfig);
  return (
    <ConfigContext.Provider value={ { config, setConfig } }>
      { children }
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
