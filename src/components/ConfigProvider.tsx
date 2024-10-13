import { useStorage } from '@plasmohq/storage/dist/hook';
import { createContext, type Dispatch, type ReactNode, type SetStateAction } from 'react';

export interface Config {
  width: number;
  fontSize: number;
  triggerWidth: number;
  bookmarkHeight: number;
  isAffixed: boolean;
  expandId: string;
  expandIds: string[];
  target: '_self' | '_blank';
  duration: number;
  mode: 'dark' | 'light';
  position: 'left' | 'right';
}

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

interface Props {
  readonly children: ReactNode;
}

const ConfigProvider = ({ children }: Props) => {
  const [ config, setConfig ] = useStorage('config', defaultConfig);
  return <ConfigContext.Provider value={ { config, setConfig } }>{ children }</ConfigContext.Provider>;
};

export default ConfigProvider;
