import { useStorage } from '@plasmohq/storage/dist/hook';
import { useUpdate } from 'ahooks';
import { createContext, type FC, type PropsWithChildren } from 'react';

export const defaultConfig: Config = {
  isFixed: false,
  mode: 'light',
  position: 'left',

  triggerWidth: 16,
  triggerTop: 5,
  triggerBottom: 5,
  triggerDelay: 0,
  width: 140,
  bookmarkHeight: 24,
  fontSize: 14,
  duration: 300,
  target: '_blank',
};

interface IConfigContext {
  config: Config;
  setConfig: Setter<Partial<Config>>;
  update: () => void;
}

export const ConfigContext = createContext<IConfigContext>(null);

const ConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  const update = useUpdate();
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
    <ConfigContext.Provider value={ { config: storageConfig, setConfig, update } }>
      { children }
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
