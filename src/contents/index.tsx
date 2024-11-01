import styles from 'data-text:~contents/style.scss';
import type { PlasmoCSConfig, PlasmoCSUIJSXContainer, PlasmoRender } from 'plasmo';
import { createRoot } from 'react-dom/client';
import ConfigProvider from '~components/ConfigProvider';
import ModalProvider from '~components/modal/ModalProvider';
import SonaBookmark from '~components/SonaBookmark';

export const config: PlasmoCSConfig = {
  matches: [ '<all_urls>' ],
};

export const getRootContainer = () => {
  const rootContainer = document.createElement('sona-bookmark');
  rootContainer.setAttribute('id', 'sona-bookmark');
  const style = document.createElement('style');
  style.textContent = styles;
  document.body.after(rootContainer);

  // 把 shadowDom 暴露出去作为根元素
  const shadowDom = rootContainer.attachShadow({ mode: 'open' });
  shadowDom.append(style);
  return shadowDom;
};

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({ createRootContainer }) => {
  const rootContainer = await createRootContainer();
  const root = createRoot(rootContainer);
  root.render(
    <ConfigProvider>
      <ModalProvider>
        <SonaBookmark />
      </ModalProvider>
    </ConfigProvider>,
  );
};
