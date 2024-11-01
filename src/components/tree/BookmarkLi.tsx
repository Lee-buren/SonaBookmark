import { sendToBackground } from '@plasmohq/messaging';
import { useDrag, useDrop } from 'ahooks';
import type { FC, MouseEvent } from 'react';
import { useContext, useMemo, useRef } from 'react';
import Add from 'react:assets/Add.svg';
import Delete from 'react:assets/Delete.svg';
import Edit from 'react:assets/Edit.svg';
import Folder from 'react:assets/Folder.svg';
import BookmarkUl from '~/components/tree/BookmarkUl';
import { ConfigContext } from '~components/ConfigProvider';
import { TreeContext } from '~components/tree/TreeProvider';
import { getElementBubble, getFavicon } from '~utils/tools';

interface IProps {
  tree: BookmarkTreeNode;
}

const ROOT_IDS = [ '0', '1', '2', '3' ]; // 根节点的 id 列表, 这几个节点不被允许修改和删除
let prevTime = performance.now(); // 用于书签展开事件的节流判断
let expandId = ''; // 当前展开id
let srcEl: HTMLElement; // 被拖拽的元素
let insert: 'top' | 'bottom' = 'bottom'; // 插入元素的位置
let clientY = 0; // 鼠标的Y坐标, 用于拖拽事件的节流判断
const BookmarkLi: FC<IProps> = ({ tree }) => {
  const { config, setConfig } = useContext(ConfigContext);
  const { dragId, setDragId, setTree, onAdd, onEdit, onDelete } = useContext(TreeContext);

  const dragRef = useRef<HTMLLIElement>(null);

  const isRoot = useMemo(() => ROOT_IDS.includes(tree.id), []);
  const isExpanded = useMemo(() => config.expandIds.includes(tree.id), [ config.expandIds ]);

  const bookmarkClick = (e: MouseEvent, element?: HTMLElement) => {
    if (tree.url) return window.open(tree.url, config.target);

    // 节流, 同一个书签在动画执行完毕前不处理
    const nowTime = performance.now();
    if (nowTime - prevTime < +config.duration && expandId === tree.id) return;
    prevTime = nowTime;

    let target = e.target as HTMLElement;
    target = element || getElementBubble(target, 'sona-bookmark__item');
    const ulEl = target.nextElementSibling as HTMLElement;
    const parentEl = target.parentElement;
    if (!target || !ulEl || !parentEl) return;

    let expandIds: string[];
    const isExpanded = parentEl.dataset.expand === 'true';
    if (isExpanded) {
      ulEl.style.height = `${ ulEl.clientHeight }px`;
      requestAnimationFrame(() => {
        ulEl.style.height = '0';
      });

      expandIds = config.expandIds.filter((item) => item !== tree.id);
    } else {
      ulEl.style.display = '';
      const clientHeight = ulEl.clientHeight;
      ulEl.style.height = '0';
      requestAnimationFrame(() => {
        ulEl.style.height = `${ clientHeight }px`;
      });

      expandIds = config.expandIds.concat(tree.id);
    }

    setTimeout(() => {
      ulEl.style.display = isExpanded ? 'none' : '';
      ulEl.style.height = '';
    }, +config.duration);

    expandId = tree.id;
    setConfig({ expandIds });
    parentEl.setAttribute('data-expand', JSON.stringify(!isExpanded));
  };

  useDrag(null, isRoot ? null : dragRef, {
    onDragStart: (e) => {
      const target = e.target as HTMLElement;
      if (isExpanded) bookmarkClick(e, target.firstElementChild as HTMLElement);

      srcEl = target;
      requestAnimationFrame(() => {
        srcEl.style.opacity = '0.5';
      });

      try {
        // firefox-need-it
        e.dataTransfer.setData('text/plain', '');
      } catch (error) {
        console.error(error);
      }
    },
    onDragEnd: () => {
      setDragId('');
      if (!srcEl) return;
      srcEl.style.opacity = '1';
      srcEl = null;
    },
  });

  useDrop(isRoot ? null : dragRef, {
    onDrop: async (e) => {
      let target = e.target as HTMLElement;
      target = getElementBubble(target, 'sona-bookmark__li');
      if (!target) return;

      const { id, pid, index, type, expand } = target.dataset;
      const isExpandedDir = type === 'directory' && expand === 'true';

      const { bookmarks, error } = await sendToBackground({
        name: 'bookmarks',
        body: {
          action: 'move',
          data: {
            id: srcEl.dataset.id,
            parentId: insert === 'bottom' && isExpandedDir ? id : pid,
            index: insert === 'bottom' ? (isExpandedDir ? 0 : +index + 1) : +index,
          },
        },
      });

      if (error) return console.error(error);

      setTree(bookmarks[0].children);
      setDragId('');
    },
    onDragOver: (e) => {
      if (clientY === e.clientY) return;
      let target = e.target as HTMLElement;
      target = getElementBubble(target, 'sona-bookmark__li');
      if (!target || target.isEqualNode(srcEl)) return;
      clientY = e.clientY;

      const { top } = target.getBoundingClientRect();
      if (clientY - top < +config.bookmarkHeight / 2) {
        insert = 'top';
        const prevEl = target.previousElementSibling as HTMLLIElement;
        setDragId(prevEl ? prevEl.dataset.id : target.dataset.pid);
      } else {
        insert = 'bottom';
        setDragId(target.dataset.id);
      }
    },
  });

  const handleAdd = (e: MouseEvent) => {
    e.stopPropagation();
    onAdd(e, tree);
  };

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    onEdit(e, tree);
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete(e, tree);
  };

  return (
    <li
      ref={ dragRef }
      className='sona-bookmark__li'
      data-id={ tree.id }
      data-pid={ tree.parentId }
      data-index={ tree.index }
      data-type={ tree.url ? 'bookmark' : 'directory' }
      data-expand={ isExpanded }
    >
      <div
        className='sona-bookmark__item'
        style={ { height: `${ config.bookmarkHeight }px` } }
        onClick={ bookmarkClick }>
        <div>
          { tree.url ?
            (<img
              style={ { display: 'block' } }
              src={ getFavicon(tree.url) }
              width={ config.fontSize }
              height={ config.fontSize }
              draggable={ false }
              alt=''
            />) :
            (<Folder
              fill={ isExpanded || !tree.children.length ? 'none' : 'currentColor' }
              width={ config.fontSize }
              height={ config.fontSize }
            />) }
        </div>
        { tree.title && (
          <div className='line-clamp-1' title={ tree.title }>
            { tree.title }
          </div>) }
        <div className='sona-bookmark__actions'>
          { !tree.url && (
            <div className='sona-bookmark-action' title='新增' onClick={ handleAdd }>
              <Add width={ config.fontSize } height={ config.fontSize } />
            </div>) }
          { !isRoot && (
            <>
              <div className='sona-bookmark-action' title='编辑' onClick={ handleEdit }>
                <Edit width={ config.fontSize } height={ config.fontSize } />
              </div>
              <div className='sona-bookmark-action' title='删除' onClick={ handleDelete }>
                <Delete width={ config.fontSize } height={ config.fontSize } />
              </div>
            </>
          ) }
        </div>

        { tree.id === dragId && <div className='sona-separation' /> }
      </div>

      { !!tree.children?.length && (<BookmarkUl pid={ tree.id } tree={ tree.children } />) }
    </li>);
};

export default BookmarkLi;