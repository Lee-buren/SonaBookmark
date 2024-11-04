import { useEventListener, useUpdateEffect } from 'ahooks';
import { useContext, useState } from 'react';
import { ConfigContext } from '~components/ConfigProvider';
import Header from '~components/Header';
import BookmarkTree from '~components/tree/BookmarkTree';

const SonaBookmark = () => {
  const { config } = useContext(ConfigContext);

  const [ style, setStyle ] = useState<Style>(() => {
    const { position, width, fontSize, duration, isFixed } = config;
    const prefix = position === 'right' ? '' : '-';
    return {
      [position]: 0,
      width: `${ width }px`,
      fontSize: `${ fontSize }px`,
      opacity: +isFixed,
      transform: `translateX(${ isFixed ? 0 : (prefix + width) }px)`,
      '--duration': `${ duration }ms`,
    };
  });

  // 监听配置变化, 更新样式;
  useUpdateEffect(() => {
    const { position, width, fontSize, duration, isFixed } = config;
    const changedStyle = {
      [position]: 0,
      width,
      fontSize,
      opacity: style.opacity,
      transform: style.transform,
      '--duration': `${ duration }ms`,
    };

    // 修改 isFixed 为 false 时, 不修改样式
    if (isFixed) {
      changedStyle.opacity = 1;
      changedStyle.transform = 'translate(0)';
    }

    setStyle(changedStyle);
  }, [ config.position, config.width, config.fontSize, config.duration, config.isFixed ]);

  // 监听鼠标移动事件, 显示/隐藏书签区域
  useEventListener('mousemove', (e) => {
    const { isFixed, position, triggerWidth, triggerTop, triggerBottom, width } = config;
    const isContainer = (e.target as HTMLElement).id === 'sona-bookmark';
    if (isFixed || isContainer) return;

    const onRight = position === 'right';
    const scrollbarWith = innerWidth - document.documentElement.clientWidth;
    const inTriggerWidth = onRight ?
      e.clientX > innerWidth - scrollbarWith - triggerWidth :
      e.clientX < triggerWidth;
    const inTriggerHeight = (e.clientY * 100 > innerHeight * triggerTop) &&
      (e.clientY * 100 < innerHeight * (100 - triggerBottom));

    // 防止重复渲染, opacity 的 1/0 代表书签的显示/隐藏状态
    const isShowHover = inTriggerWidth && inTriggerHeight && style.opacity;
    const isHideHover = !inTriggerWidth && !inTriggerHeight && !style.opacity;
    if (isShowHover || isHideHover) return;

    const prefix = onRight ? '' : '-';
    const triggerStyle = inTriggerWidth && inTriggerHeight ?
      { transform: 'translate(0)', opacity: 1 } :
      { transform: `translate(${ prefix + width }px)`, opacity: 0 };

    setStyle((prev) => ({ ...prev, ...triggerStyle }));
  });

  return (
    <div className={ `sona-wrapper ${ config.mode } ${ config.position }` } style={ style }>
      <Header />

      <BookmarkTree />
    </div>
  );
};

export default SonaBookmark;