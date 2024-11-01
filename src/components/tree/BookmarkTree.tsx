import { sendToBackground } from '@plasmohq/messaging';
import { useAsyncEffect } from 'ahooks';
import { type CSSProperties, type MouseEvent, useContext, useRef, useState } from 'react';
import BookmarkUl from '~/components/tree/BookmarkUl';
import HandleModal from '~components/modal/HandleModal';
import { ModalContext } from '~components/modal/ModalProvider';
import TreeProvider from '~components/tree/TreeProvider';
import { getElementBubble } from '~utils/tools';

export type HandleType = 'add' | 'edit' | 'delete'

const BookmarkTree = () => {
  const { setModal } = useContext(ModalContext);

  const modalRef = useRef<HTMLDivElement>(null);

  const [ tree, setTree ] = useState<BookmarkTreeNode[]>([]);
  const [ style, setStyle ] = useState<CSSProperties>({});
  const [ type, setType ] = useState<HandleType>('add');
  const [ form, setForm ] = useState<HandleForm>({
    id: '',
    parentId: '',
    parentTitle: '',
    title: '',
    type: 'directory',
    url: '',
  });

  useAsyncEffect(async () => {
    const { bookmarks, error } = await sendToBackground({ name: 'bookmarks' });
    if (error) return console.error(error);
    setTree(bookmarks[0].children);
  }, []);

  const onAdd = (e: MouseEvent, bookmark: BookmarkTreeNode) => {
    const { id, title } = bookmark;
    setForm({ type: 'directory', parentId: id, parentTitle: title, id: '', title: '', url: '' });
    setType('add');
    setModal('Handle');
    handleStyle(e);
  };

  const onEdit = (e: MouseEvent, bookmark: BookmarkTreeNode) => {
    const { parentId, id, title, url = '' } = bookmark;
    const type = url ? 'bookmark' : 'directory';
    setForm({ type, parentId, parentTitle: '', id, title, url });
    setType('edit');
    setModal('Handle');
    handleStyle(e);
  };

  const onDelete = (e: MouseEvent, bookmark: BookmarkTreeNode) => {
    const { id, title, url } = bookmark;
    const type = url ? 'bookmark' : 'directory';
    setForm({ type, parentId: '', parentTitle: '', id, title, url: '' });
    setType('delete');
    setModal('Handle');
    handleStyle(e);
  };

  const handleStyle = (e: MouseEvent) => {
    let target = e.target as HTMLElement;
    target = getElementBubble(target, 'sona-bookmark__item');
    const { top } = target.getBoundingClientRect();
    requestAnimationFrame(() => {
      const height = modalRef.current?.clientHeight ?? 0;
      const maxTop = window.innerHeight - height;
      setStyle({ top: top > maxTop ? maxTop : top });
    });
  };

  return (
    <>
      <TreeProvider setTree={ setTree } onAdd={ onAdd } onEdit={ onEdit } onDelete={ onDelete }>
        <BookmarkUl tree={ tree } />
      </TreeProvider>

      <HandleModal ref={ modalRef } style={ style } type={ type } form={ form } setTree={ setTree } />
    </>
  );
};

export default BookmarkTree;
