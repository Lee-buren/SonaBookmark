import { sendToBackground } from '@plasmohq/messaging';
import { useDrag, useDrop } from 'ahooks';
import type { CSSProperties, MouseEvent } from 'react';
import { forwardRef, memo, useContext, useRef, useState } from 'react';
import Add from 'react:../../assets/Add.svg';
import Delete from 'react:../../assets/Delete.svg';
import Edit from 'react:../../assets/Edit.svg';
import Folder from 'react:../../assets/Folder.svg';
import { ConfigContext } from '~components/ConfigProvider';
import { TreeContext } from '~components/TreeProvider';
import { faviconURL, getElement } from '~utils/tools';

export type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

export enum HandleType {
  ADD = 'add', EDIT = 'edit', DELETE = 'delete'
}

interface ContentProps {
  tree: BookmarkTreeNode;
}

const ROOT_IDS = [ '0', '1', '2', '3' ]; // 根节点的 id 列表, 这几个节点不被允许修改和删除
let srcEl: HTMLElement; // 被拖拽的元素
let clientY = 0; // 鼠标的Y坐标, 用于拖拽事件的节流判断
let insert: 'top' | 'bottom' = 'bottom'; // 插入元素的位置
let prevTime = Date.now(); // 当前时间,用于展开事件的节流判断
const BookmarkList = ({ tree }: ContentProps) => {
  const { dragId, setDragId, setTreeData, onAdd, onEdit, onDelete } = useContext(TreeContext);
  const { config, setConfig } = useContext(ConfigContext);

  const contentClick = (e: MouseEvent) => {
    if (tree.url) return window.open(tree.url, config.target);

    // 节流, 同一个书签在动画执行完毕前不处理
    const nowTime = Date.now();
    if (nowTime - prevTime <= config.duration && config.expandId === tree.id) return;
    prevTime = nowTime;

    const target = getElement(e.target as HTMLElement, 'sona-bookmark-content');
    if (!target) return;
    const ulEl = target.nextElementSibling as HTMLUListElement;
    if (!ulEl) return;
    // 展开/收起
    let expandIds: string[];
    const isExpand = target.parentElement.dataset.expand === 'true';
    if (isExpand) {
      ulEl.style.height = `${ ulEl.clientHeight }px`;
      requestAnimationFrame(() => {
        ulEl.style.height = '0';
      });
      expandIds = config.expandIds.filter((item) => item !== tree.id);
    } else {
      ulEl.style.display = '';
      const height = ulEl.clientHeight;
      ulEl.style.height = '0';
      requestAnimationFrame(() => {
        ulEl.style.height = `${ height }px`;
      });
      expandIds = config.expandIds.concat(tree.id);
    }
    target.parentElement.setAttribute('data-expand', String(!isExpand));
    setConfig({ ...config, expandIds, expandId: tree.id });

    setTimeout(() => {
      ulEl.style.display = isExpand ? 'none' : '';
      ulEl.style.height = '';
    }, config.duration);
  };

  const isRoot = ROOT_IDS.includes(tree.id);
  const dragRef = useRef<HTMLLIElement>(null);
  useDrag(tree, isRoot ? null : dragRef, {
    onDragStart: (e) => {
      setDragId('');
      srcEl = e.target as HTMLElement;
      requestAnimationFrame(() => {
        srcEl.style.opacity = '0.5';
      });

      try {
        // firefox-need-it
        e.dataTransfer.setData('text/plain', '');
      } catch (error) {}
    },
    onDragEnd: () => {
      setDragId('');
      if (!srcEl) return;
      srcEl.style.opacity = '';
      srcEl = null;
    },
  });
  useDrop(isRoot ? null : dragRef, {
    onDrop: async (e) => {
      let target = e.target as HTMLElement;
      if (target.classList.contains('sona-bookmark-ul')) return;
      target = getElement(target, 'sona-bookmark-li');
      if (!target) return;

      const { id } = srcEl.dataset;
      const { id: lastId, pid, index, type, expand } = target.dataset;
      const isExpandDir = type === 'directory' && expand === 'true';

      const { bookmarks, error } = await sendToBackground({
        name: 'bookmarks', body: {
          action: 'move', data: {
            id,
            parentId: insert === 'bottom' && isExpandDir ? lastId : pid,
            index: insert === 'bottom' ? (isExpandDir ? 0 : +index + 1) : +index,
          },
        },
      });
      if (error) return console.error(error);

      setTreeData(bookmarks[0].children);
      setDragId('');
    },
    onDragOver: (e) => {
      // clientY在同一行上或在 父级li元素 上时不处理
      let target = e.target as HTMLElement;
      if (clientY === e.clientY || target.classList.contains('sona-bookmark-ul')) return;
      clientY = e.clientY;
      target = getElement(target, 'sona-bookmark-li');
      if (!target || target.isEqualNode(srcEl)) return;
      const { top } = target.getBoundingClientRect();
      if (e.clientY < top + config.bookmarkHeight / 2) {
        const prevEl = target.previousSibling as HTMLLIElement;
        setDragId(prevEl ? prevEl.dataset.id : target.dataset.pid);
        insert = 'top';
      } else {
        setDragId(target.dataset.id);
        insert = 'bottom';
      }
    },
  });

  const isExpand = config.expandIds.includes(tree.id);
  return (
    <li ref={ dragRef }
      className='sona-bookmark-li'
      data-id={ tree.id }
      data-pid={ tree.parentId }
      data-index={ tree.index }
      data-type={ tree.url ? 'bookmark' : 'directory' }
      data-expand={ isExpand }>
      <div className='sona-bookmark-content'
        style={ { height: config.bookmarkHeight, transitionDuration: `${ config.duration }ms` } }
        onClick={ contentClick }>
        <div>
          { tree.url ?
            (<img style={ { width: config.fontSize, height: config.fontSize } }
              src={ faviconURL(tree.url) }
              draggable={ false }
              alt='' />) :
            (<Folder fill={ isExpand ? 'none' : 'currentColor' }
              width={ config.fontSize }
              height={ config.fontSize } />) }
        </div>

        { tree.title && (
          <div className='line-clamp-1' title={ tree.title }>
            { tree.title }
          </div>) }

        <div className='sona-bookmark-content-actions'>
          { !tree.url && (
            <div className='sona-bookmark-content-svg'
              title='新增'
              onClick={ (e) => {
                e.stopPropagation();
                onAdd(e, tree);
              } }>
              <Add style={ { width: config.fontSize, height: config.fontSize } } />
            </div>) }
          { !isRoot && (<>
            <div className='sona-bookmark-content-svg'
              title='编辑'
              onClick={ (e) => {
                e.stopPropagation();
                onEdit(e, tree);
              } }>
              <Edit style={ { width: config.fontSize, height: config.fontSize } } />
            </div>
            <div className='sona-bookmark-content-svg'
              title='删除'
              onClick={ (e) => {
                e.stopPropagation();
                onDelete(e, tree);
              } }>
              <Delete style={ { width: config.fontSize, height: config.fontSize } } />
            </div>
          </>) }
        </div>

        { tree.id === dragId && <div className='sona-bookmark-separation' /> }
      </div>
      { tree.children && (<BookmarkTree pid={ tree.id } treeData={ tree.children } />) }
    </li>);
};

interface Props {
  pid?: string;
  treeData: BookmarkTreeNode[];
}

const BookmarkTree = forwardRef<HTMLUListElement, Props>(({ pid = '0', treeData = [] }, ref) => {
  const { config } = useContext(ConfigContext);
  const belongRoot = pid === '0';
  const [ className ] = useState(() => belongRoot ? 'sona-bookmark-tree' : 'sona-bookmark-ul');
  const [ style ] = useState<CSSProperties>(() => ({
    display: belongRoot || config.expandIds.includes(pid) ? '' : 'none',
  }));
  return (
    <ul ref={ ref }
      style={ { ...style, transitionDuration: belongRoot ? '' : `${ config.duration }ms` } }
      className={ className }>
      { treeData.map((tree) => (<BookmarkList key={ tree.id } tree={ tree } />)) }
    </ul>
  );
});

export default memo(BookmarkTree);
