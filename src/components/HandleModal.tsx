import { sendToBackground } from '@plasmohq/messaging';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { type BookmarkTreeNode, HandleType } from '~components/BookmarkTree';
import Modal from '~components/Modal';

export interface Form {
  type: 'directory' | 'bookmark';
  parentId: string;
  parentTitle: string;
  id: string;
  title: string;
  url: string;
}

enum BookmarkTitle {
  add = '新增', edit = '编辑', delete = '删除'
}

interface Props {
  top?: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: HandleType;
  formData: Form;
  setTreeData: Dispatch<SetStateAction<BookmarkTreeNode[]>>;
}

const HandleModal = ({ top, open, setOpen, type, formData, setTreeData }: Props) => {
  const [ form, setForm ] = useState(formData);

  useEffect(() => {
    setForm(formData);
  }, [ formData ]);

  const formChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'type') {
      // 切换类型时，清空表单
      setUrlIsEmpty(false);
      setUrlError('');
      setForm({ ...form, type: value as 'directory' | 'bookmark', title: '', url: '' });
      return;
    } else if (name === 'url') {
      setUrlIsEmpty(false);
      setUrlError('');
    }
    setForm({ ...form, [name]: value });
  };

  const [ urlIsEmpty, setUrlIsEmpty ] = useState(false);
  const [ urlError, setUrlError ] = useState('');

  const onSave = async () => {
    setUrlIsEmpty(false);
    setUrlError('');

    const { type: formType, parentId, id, title, url } = form;
    if (type !== HandleType.DELETE && formType === 'bookmark' && url === '') {
      setUrlIsEmpty(true);
      setUrlError('不能为空');
      return;
    }

    const { bookmarks, error } = await sendToBackground({
      name: 'bookmarks',
      body: { action: type, data: { parentId, id, title, url } },
    });
    if (error) {
      setUrlIsEmpty(true);
      setUrlError(error.includes('Invalid URL') ? '无效网址' : error);
      return;
    }

    setTreeData(bookmarks[0].children);
    onCancel();
  };

  const onCancel = () => setOpen(false);

  return (
    <Modal
      top={ top }
      title={ BookmarkTitle[type] }
      open={ open }
      saveText={ type === HandleType.DELETE ? '确认' : '保存' }
      onSave={ onSave }
      onCancel={ onCancel }
      formItems={ [
        type === HandleType.ADD && (
          <>
            <span>上级目录:</span>
            <input value={ form.parentTitle } disabled />
          </>
        ),
        type === HandleType.ADD && (
          <>
            <span>类型:</span>
            <div className='sona-bookmark-radio-group'>
              <label>
                <input
                  type='radio'
                  name='type'
                  value='directory'
                  checked={ form.type === 'directory' }
                  onChange={ formChange }
                />
                <span>目录</span>
              </label>
              <label>
                <input
                  type='radio'
                  name='type'
                  value='bookmark'
                  checked={ form.type === 'bookmark' }
                  onChange={ formChange }
                />
                <span>书签</span>
              </label>
            </div>
          </>
        ),
        type !== HandleType.DELETE && (
          <>
            <span>书签名称:</span>
            <input name='title' value={ form.title } onChange={ formChange } />
          </>
        ),
        type !== HandleType.DELETE && form.type === 'bookmark' && (
          <>
            <span>书签网址:</span>
            { urlError && <span style={ { color: 'red', marginLeft: 4 } }>{ urlError }</span> }
            <input
              className={ urlIsEmpty ? 'sona-bookmark-input-empty' : '' }
              name='url'
              value={ form.url }
              onChange={ formChange }
            />
          </>
        ),
        type === HandleType.DELETE && (
          <>
            <span>{ form.type === 'directory' ? '将删除所有子目录和书签' : '将删除书签' }</span>
            <p className='line-clamp-1'
              style={ { height: '20px', lineHeight: '20px', fontWeight: 'bolder' } }>
              { form.title }
            </p>
          </>
        ),
      ] }
    />
  );
};

export default HandleModal;
