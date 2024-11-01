import { useEventListener, useUpdateEffect } from 'ahooks';
import { useContext, useState } from 'react';
import { ConfigContext } from '~components/ConfigProvider';
import Header from '~components/Header';
import { ModalContext } from '~components/modal/ModalProvider';
import BookmarkTree from '~components/tree/BookmarkTree';

const SonaBookmark = () => {
  const { config } = useContext(ConfigContext);
  const { modal } = useContext(ModalContext);

  const [ style, setStyle ] = useState<Style>(() => {
    const { position, width, fontSize, duration, isAffixed } = config;
    const prefix = position === 'right' ? '' : '-';
    return {
      [position]: 0,
      width: `${ width }px`,
      fontSize: `${ fontSize }px`,
      opacity: +isAffixed,
      transform: `translateX(${ isAffixed ? 0 : (prefix + width) }px)`,
      '--duration': `${ duration }ms`,
    };
  });

  // 监听配置变化, 更新样式;
  useUpdateEffect(() => {
    const { position, width, fontSize, duration, isAffixed } = config;

    const changedStyle = {
      [position]: 0,
      width: `${ width }px`,
      fontSize: `${ fontSize }px`,
      opacity: style.opacity,
      transform: style.transform,
      '--duration': `${ duration }ms`,
    };

    // 修改 isAffixed值 为 false 时, 不修改样式
    if (isAffixed) {
      changedStyle.opacity = 1;
      changedStyle.transform = 'translate(0)';
    }

    setStyle(changedStyle);
  }, [ config.position, config.width, config.fontSize, config.duration, config.isAffixed ]);

  // 监听鼠标移动事件, 显示/隐藏书签区域
  useEventListener('mousemove', (e) => {
    const { isAffixed, position, triggerWidth, width } = config;
    const isContainer = (e.target as HTMLElement).id === 'sona-bookmark';
    if (isAffixed || isContainer || modal) return;

    const onRight = position === 'right';
    const scrollbarWith = window.innerWidth - document.documentElement.clientWidth;
    const inTriggerArea = onRight ?
      e.clientX > innerWidth - scrollbarWith - +triggerWidth :
      e.clientX < +triggerWidth;

    // 防止重复渲染, opacity 的 1/0 代表书签的显示/隐藏状态
    if ((inTriggerArea && style.opacity) || (!inTriggerArea && !style.opacity)) return;

    const prefix = onRight ? '' : '-';
    const triggerStyle = inTriggerArea ?
      { transform: 'translate(0)', opacity: 1 } :
      { transform: `translate(${ prefix + width }px)`, opacity: 0 };

    setStyle({ ...style, ...triggerStyle });
  });

  return (
    <div className={ `sona-wrapper ${ config.mode } ${ config.position }` } style={ style }>
      <Header />

      <BookmarkTree />
    </div>
  );
};

export default SonaBookmark;