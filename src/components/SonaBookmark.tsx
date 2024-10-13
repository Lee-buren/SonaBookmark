import { sendToBackground } from '@plasmohq/messaging';
import { useAsyncEffect, useEventListener, useUpdateEffect } from 'ahooks';
import type { CSSProperties, MouseEvent } from 'react';
import { useContext, useState } from 'react';
import Moon from 'react:../../assets/Moon.svg';
import Pin from 'react:../../assets/Pin.svg';
import PinOff from 'react:../../assets/PinOff.svg';
import Setting from 'react:../../assets/Setting.svg';
import Sun from 'react:../../assets/Sun.svg';
import ToLeft from 'react:../../assets/ToLeft.svg';
import ToRight from 'react:../../assets/ToRight.svg';
import BookmarkTree, { type BookmarkTreeNode, HandleType } from '~components/BookmarkTree';
import { ConfigContext } from '~components/ConfigProvider';
import HandleModal, { type Form } from '~components/HandleModal';
import SettingModal from '~components/SettingModal';
import TreeProvider from '~components/TreeProvider';
import { getElement } from '~utils/tools';

const SonaBookmark = () => {
  const { config, setConfig } = useContext(ConfigContext);

  const [ style, setStyle ] = useState<CSSProperties>(() => {
    const { position, width, fontSize, isAffixed, duration } = config;
    return {
      [position]: 0,
      width,
      fontSize,
      opacity: +isAffixed,
      transform: `translate(${ isAffixed ? '0' : (position === 'right' ? '' : '-') + width }px)`,
      transitionDuration: `${ duration }ms`,
    };
  });

  // 监听配置变化, 更新样式
  useUpdateEffect(() => {
    const { position, width, fontSize, duration, isAffixed } = config;
    const changedStyle: CSSProperties = { [position]: 0, width, fontSize, transitionDuration: `${ duration }ms` };
    // button 改变 isAffixed 时, 不能修改样式
    if (isAffixed) {
      changedStyle.opacity = 1;
      changedStyle.transform = `translate(0)`;
    }
    // position 的值(left/right)直接作为样式, 所以只保留一个, 不直接使用解构 style 传值
    const { opacity, transform } = style;
    setStyle({ opacity, transform, ...changedStyle });
  }, [ config ]);

  // 监听鼠标移动事件, 显示/隐藏书签区域
  useEventListener('mousemove', (e) => {
    const isContainer = (e.target as HTMLElement).localName === 'sona-bookmark';
    if (config.isAffixed || isContainer || settingOpen || handleOpen) return;

    const inTriggerArea = config.position === 'right' ?
      e.clientX > innerWidth - config.triggerWidth :
      e.clientX < config.triggerWidth;
    const triggerStyle = inTriggerArea ?
      { transform: 'translate(0)', opacity: '1' } :
      { transform: `translate(${ (config.position === 'right' ? '' : '-') + config.width }px)`, opacity: '0' };
    setStyle({ ...style, ...triggerStyle });
  });

  // 获取书签数据
  const [ treeData, setTreeData ] = useState<BookmarkTreeNode[]>();
  useAsyncEffect(async () => {
    const { bookmarks } = await sendToBackground({ name: 'bookmarks' });
    setTreeData(bookmarks[0].children);
  }, []);

  const affixClick = () => {
    setConfig({ ...config, isAffixed: !config.isAffixed });
  };
  const modeClick = () => {
    setConfig({ ...config, mode: config.mode === 'dark' ? 'light' : 'dark' });
  };
  const positionClick = () => {
    setConfig({ ...config, position: config.position === 'right' ? 'left' : 'right', isAffixed: true });
  };
  const settingClick = () => setSettingOpen(!settingOpen);

  const [ settingOpen, setSettingOpen ] = useState(false);
  const [ handleOpen, setHandleOpen ] = useState(false);
  // 弹窗在容器外,所以弹窗关闭时会同时关闭容器,所以在弹窗打开时让容器固定
  useUpdateEffect(() => {
    if (!settingOpen && !handleOpen) return;
    setConfig({ ...config, isAffixed: true });
  }, [ settingOpen, handleOpen ]);

  useUpdateEffect(() => {
    if (!settingOpen) return;
    setHandleOpen(false);
  }, [ settingOpen ]);

  useUpdateEffect(() => {
    if (!handleOpen) return;
    setSettingOpen(false);
  }, [ handleOpen ]);

  const [ handleType, setHandleType ] = useState(HandleType.ADD);
  const [ handleFormData, setHandleFormData ] = useState<Form>({
    type: 'directory', parentId: '', parentTitle: '', id: '', title: '', url: '',
  });
  const [ modalTop, setModalTop ] = useState(0);

  const bookmarkHandle = (e: MouseEvent, bookmark: BookmarkTreeNode, type: HandleType) => {
    const { parentId, id, title, url = '' } = bookmark;
    const bookmarkType = url ? 'bookmark' : 'directory';
    if (type === HandleType.ADD) {
      setHandleFormData({ type: 'directory', parentId: id, parentTitle: title, id: '', title: '', url: '' });
    } else if (type === HandleType.EDIT) {
      setHandleFormData({ type: bookmarkType, parentId, parentTitle: '', id, title, url });
    } else if (type === HandleType.DELETE) {
      setHandleFormData({ type: bookmarkType, parentId: '', parentTitle: '', id, title, url: '' });
    }

    const target = getElement(e.target as HTMLElement, 'sona-bookmark-content');
    const { top } = target.getBoundingClientRect();
    setModalTop(top);
    setHandleType(type);
    setHandleOpen(true);
  };

  const [ dragId, setDragId ] = useState('');
  return (
    <div className={ 'sona-bookmark-wrapper ' + config.mode } style={ style }>
      <div className={ `sona-bookmark-actions ${ config.position === 'right' ? 'row-reverse' : 'row' }` }>
        <div className='sona-bookmark-actions-left'>
          <div className='sona-bookmark-svg' title={ config.isAffixed ? '固定' : '不固定' } onClick={ affixClick }>
            { config.isAffixed ? <Pin /> : <PinOff /> }
          </div>
          <div className='sona-bookmark-svg' title={ config.mode } onClick={ modeClick }>
            { config.mode === 'dark' ? <Moon /> : <Sun /> }
          </div>
        </div>
        <div className='sona-bookmark-actions-right'>
          <div className='sona-bookmark-svg'
            title={ config.position === 'right' ? '切换左栏' : '切换右栏' }
            onClick={ positionClick }>
            { config.position === 'right' ? <ToLeft /> : <ToRight /> }
          </div>
          <div className='sona-bookmark-svg' title='设置' onClick={ settingClick }>
            <Setting />
          </div>
        </div>
      </div>

      <TreeProvider
        dragId={ dragId }
        setDragId={ setDragId }
        setTreeData={ setTreeData }
        onAdd={ (e, tree) => bookmarkHandle(e, tree, HandleType.ADD) }
        onEdit={ (e, tree) => bookmarkHandle(e, tree, HandleType.EDIT) }
        onDelete={ (e, tree) => bookmarkHandle(e, tree, HandleType.DELETE) }>
        <BookmarkTree treeData={ treeData } />
      </TreeProvider>

      <SettingModal open={ settingOpen } setOpen={ setSettingOpen } />

      <HandleModal
        top={ modalTop }
        open={ handleOpen }
        setOpen={ setHandleOpen }
        type={ handleType }
        formData={ handleFormData }
        setTreeData={ setTreeData } />
    </div>
  );
};

export default SonaBookmark;