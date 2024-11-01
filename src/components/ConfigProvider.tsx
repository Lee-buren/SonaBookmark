import { useStorage } from '@plasmohq/storage/dist/hook';
import { createContext, type FC, type PropsWithChildren } from 'react';

export const defaultConfig: Config = {
  position: 'left',
  width: '140',
  fontSize: '14',
  triggerWidth: '16',
  bookmarkHeight: '24',
  duration: '300',
  isAffixed: false,
  expandIds: [],
  target: '_blank',
  mode: 'light',
};

interface IConfigContext {
  config: Config;
  setConfig: Setter<Partial<Config>>;
}

export const ConfigContext = createContext<IConfigContext>(null);

const ConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ storageConfig, setStorageConfig, { isLoading } ] = useStorage('config', defaultConfig);

  // 如果 config参数 传递的属性值与 storageConfig 的一样则不更新
  const setConfig = (config: Partial<Config>) => {
    for (const key in config) {
      if (config[key] !== storageConfig[key]) {
        setStorageConfig({ ...storageConfig, ...config });
        break;
      }
    }
  };

  if (isLoading) return null;
  return (
    <ConfigContext.Provider value={ { config: storageConfig, setConfig } }>
      { children }
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
