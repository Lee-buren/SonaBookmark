import styles from 'data-text:~contents/style.scss';
import type { PlasmoCSConfig, PlasmoCSUIJSXContainer, PlasmoRender } from 'plasmo';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ConfigProvider from '~components/ConfigProvider';
import SonaBookmark from '~components/SonaBookmark';

export const config: PlasmoCSConfig = {
  matches: [ '<all_urls>' ],
};

export const getRootContainer = () => {
  const rootContainer = document.createElement('sona-bookmark');
  const shadowDom = rootContainer.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = styles;
  shadowDom.append(style);
  document.body.after(rootContainer);
  return shadowDom;
};

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({ createRootContainer }) => {
  const rootContainer = await createRootContainer();
  createRoot(rootContainer).render(
    <StrictMode>
      <ConfigProvider>
        <SonaBookmark />
      </ConfigProvider>
    </StrictMode>,
  );
};
