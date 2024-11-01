import type { FC, MouseEvent, PropsWithChildren } from 'react';
import { createContext, useState } from 'react';

type HandleFn = (e: MouseEvent, bookmark: BookmarkTreeNode) => void;

export interface ITreeContext {
  dragId: string;
  setDragId: Setter<string>;
  setTree: Setter<BookmarkTreeNode[]>;
  onAdd: HandleFn;
  onEdit: HandleFn;
  onDelete: HandleFn;
}

export const TreeContext = createContext<ITreeContext>(null);

interface IProps extends Omit<ITreeContext, 'dragId' | 'setDragId'> {}

const TreeProvider: FC<PropsWithChildren<IProps>> = ({ children, setTree, onAdd, onEdit, onDelete }) => {
  const [ dragId, setDragId ] = useState('');

  return (
    <TreeContext.Provider value={ { dragId, setDragId, setTree, onAdd, onEdit, onDelete } }>
      { children }
    </TreeContext.Provider>
  );
};

export default TreeProvider;
