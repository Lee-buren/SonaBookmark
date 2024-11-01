import type { FC } from 'react';
import { useContext, useMemo } from 'react';
import { ConfigContext } from '~components/ConfigProvider';
import BookmarkLi from '~components/tree/BookmarkLi';

interface IProps {
  pid?: string;
  tree: BookmarkTreeNode[];
}

const BookmarkUl: FC<IProps> = ({ pid, tree }) => {
  const { config } = useContext(ConfigContext);

  // display属性会在展开/收起操作时被覆盖
  const display = useMemo(() => !pid || config.expandIds.includes(pid) ? '' : 'none', []);

  return (
    <ul className={ `sona-bookmark${ !pid ? '' : '__ul' }` } style={ { display } }>
      { tree.map((tree) => (
        <BookmarkLi key={ tree.id } tree={ tree } />
      )) }
    </ul>
  );
};

export default BookmarkUl;