import { useStorage } from '@plasmohq/storage/dist/hook';
import type { FC, MouseEvent, PropsWithChildren } from 'react';
import { createContext, useState } from 'react';

type HandleFn = (e: MouseEvent, bookmark: BookmarkTreeNode) => void;

export interface ITreeContext {
  dragId: string;
  expandIds: string[];
  setDragId: Setter<string>;
  setExpandIds: Setter<string[]>;
  setTree: Setter<BookmarkTreeNode[]>;
  onAdd: HandleFn;
  onEdit: HandleFn;
  onDelete: HandleFn;
}

export const TreeContext = createContext<ITreeContext>(null);

interface IProps {
  setTree: Setter<BookmarkTreeNode[]>;
  onAdd: HandleFn;
  onEdit: HandleFn;
  onDelete: HandleFn;
}

const TreeProvider: FC<PropsWithChildren<IProps>> = ({ children, setTree, onAdd, onEdit, onDelete }) => {
  const [ dragId, setDragId ] = useState('');
  const [ expandIds, setExpandIds, { isLoading } ] = useStorage('expandIds', []);

  if (isLoading) return null;
  return (
    <TreeContext.Provider value={ { dragId, expandIds, setDragId, setExpandIds, setTree, onAdd, onEdit, onDelete } }>
      { children }
    </TreeContext.Provider>
  );
};

export default TreeProvider;
