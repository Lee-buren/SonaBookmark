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
  const { config } = useContext(ConfigContext);
  const { dragId, expandIds, setDragId, setExpandIds, setTree, onAdd, onEdit, onDelete } = useContext(TreeContext);

  const dragRef = useRef<HTMLLIElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  const isRoot = useMemo(() => ROOT_IDS.includes(tree.id), []);
  const isExpanded = useMemo(() => expandIds.includes(tree.id), [ expandIds ]);
  const iconSize = useMemo(() => ({ width: config.fontSize, height: config.fontSize }), [ config.fontSize ]);

  const bookmarkClick = () => {
    if (tree.url) return window.open(tree.url, config.target);

    // 节流, 同一个书签在动画执行完毕前不处理
    const nowTime = performance.now();
    if (nowTime - prevTime < config.duration && expandId === tree.id) return;
    prevTime = nowTime;

    const target = ulRef.current;
    const parent = target.parentElement;
    if (!target || !parent) return;

    let _expandIds: string[];
    const isExpanded = JSON.parse(parent.dataset.expand);
    if (isExpanded) {
      target.style.height = `${ target.clientHeight }px`;
      requestAnimationFrame(() => {
        target.style.height = '0';
      });

      _expandIds = expandIds.filter((item) => item !== tree.id);
    } else {
      target.style.display = '';
      const height = target.clientHeight;
      target.style.height = '0';
      requestAnimationFrame(() => {
        target.style.height = `${ height }px`;
      });

      _expandIds = expandIds.concat(tree.id);
    }

    setTimeout(() => {
      target.style.display = isExpanded ? 'none' : '';
      target.style.height = '';
    }, config.duration);

    expandId = tree.id;
    setExpandIds(_expandIds);
    parent.setAttribute('data-expand', JSON.stringify(!isExpanded));
  };

  useDrag(null, isRoot ? null : dragRef, {
    onDragStart: (e) => {
      // 如果是展开状态则收起
      isExpanded && bookmarkClick();

      srcEl = e.target as HTMLElement;
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
      const isBottom = insert === 'bottom';
      const { bookmarks, error } = await sendToBackground({
        name: 'bookmarks',
        body: {
          action: 'move',
          data: {
            id: srcEl.dataset.id,
            parentId: isBottom && isExpandedDir ? id : pid,
            index: isBottom ? (isExpandedDir ? 0 : +index + 1) : +index,
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
              draggable={ false }
              alt=''{ ...iconSize } />) :
            (<Folder fill={ isExpanded || !tree.children.length ? 'none' : 'currentColor' } { ...iconSize } />) }
        </div>

        { tree.title && (
          <div className='line-clamp-1' title={ tree.title }>
            { tree.title }
          </div>) }

        <div className='sona-bookmark__actions'>
          { !tree.url && (
            <div className='sona-bookmark-action' title='新增' onClick={ handleAdd }>
              <Add { ...iconSize } />
            </div>) }

          { !isRoot && (
            <>
              <div className='sona-bookmark-action' title='编辑' onClick={ handleEdit }>
                <Edit { ...iconSize } />
              </div>
              <div className='sona-bookmark-action' title='删除' onClick={ handleDelete }>
                <Delete { ...iconSize } />
              </div>
            </>
          ) }
        </div>

        { tree.id === dragId && <div className='sona-separation' /> }
      </div>

      { tree.children && (<BookmarkUl ref={ ulRef } pid={ tree.id } tree={ tree.children } />) }
    </li>);
};

export default BookmarkLi;