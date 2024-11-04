import { forwardRef, useContext, useMemo } from 'react';
import BookmarkLi from '~components/tree/BookmarkLi';
import { TreeContext } from '~components/tree/TreeProvider';

interface IProps {
  pid?: string;
  tree: BookmarkTreeNode[];
}

const BookmarkUl = forwardRef<HTMLUListElement, IProps>((({ pid, tree }, ref) => {
  const { expandIds } = useContext(TreeContext);

  // display属性会在展开/收起操作时被覆盖
  const display = useMemo(() => !pid || expandIds.includes(pid) ? '' : 'none', []);

  return (
    <ul ref={ ref } className={ `sona-bookmark${ pid ? '__ul' : '' }` } style={ { display } }>
      { tree.map((item) => (
        <BookmarkLi key={ item.id } tree={ item } />
      )) }
    </ul>
  );
}));

export default BookmarkUl;