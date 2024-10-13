import { createContext, type Dispatch, type MouseEvent, type ReactNode, type SetStateAction } from 'react';
import type { BookmarkTreeNode } from '~components/BookmarkTree';

type HandleFn = (e: MouseEvent, bookmark: BookmarkTreeNode) => void;

interface Context {
  dragId: string;
  setDragId: Dispatch<SetStateAction<string>>;
  setTreeData: Dispatch<SetStateAction<BookmarkTreeNode[]>>;
  onAdd: HandleFn;
  onEdit: HandleFn;
  onDelete: HandleFn;
}

export const TreeContext = createContext<Context>({
  dragId: '',
  setDragId: (id: string) => id,
  setTreeData: (data: BookmarkTreeNode[]) => data,
  onAdd: () => {},
  onEdit: () => {},
  onDelete: () => {},
});

interface Props extends Context {
  readonly children: ReactNode;
}

const TreeProvider = ({ dragId, setDragId, setTreeData, onAdd, onEdit, onDelete, children }: Props) => {
  return <TreeContext.Provider value={ { dragId, setDragId, setTreeData, onAdd, onEdit, onDelete } }>
    { children }
  </TreeContext.Provider>;
};

export default TreeProvider;
