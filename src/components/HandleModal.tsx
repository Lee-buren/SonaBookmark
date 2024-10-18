import { sendToBackground } from '@plasmohq/messaging';
import type { ChangeEvent } from 'react';
import { memo, useState } from 'react';
import Modal from '~components/Modal';

interface HandleFormStatus {
  url: {
    status: 'normal' | 'error',
    text: string
  };
}

interface Props {
  top?: number;
  open: boolean;
  setOpen: Setter<boolean>;
  type: HandleType;
  formData: HandleForm;
  setFormData: Setter<HandleForm>;
  setTreeData: Setter<BookmarkTreeNode[]>;
}

const modalTitles = { add: '新增', edit: '编辑', delete: '删除' };
const initialForm: HandleForm = { type: 'directory', parentId: '', parentTitle: '', id: '', title: '', url: '' };
const HandleModal = ({ top, open, setOpen, type, formData = initialForm, setFormData, setTreeData }: Props) => {
  const [ formStatus, setFormStatus ] = useState<HandleFormStatus>({
    url: { status: 'normal', text: '' },
  });

  const formChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'type') {
      // 改变 type值 时，清空表单
      setFormStatus({ url: { status: 'normal', text: '' } });
      setFormData({ ...formData, [name]: value as BookmarkType, title: '', url: '' });
    } else {
      if (name === 'url') setFormStatus({ url: { status: 'normal', text: '' } });
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSave = async () => {
    setFormStatus({ url: { status: 'normal', text: '' } });

    const { type: formType, parentId, id, title, url } = formData;
    if (type !== 'delete' && formType === 'bookmark' && url === '') {
      return setFormStatus({ url: { status: 'error', text: '不能为空' } });
    }

    const { bookmarks, error } = await sendToBackground({
      name: 'bookmarks',
      body: { action: type, data: { parentId, id, title, url } },
    });
    if (error) {
      const text = error.includes('Invalid URL') ? '无效网址' : error;
      return setFormStatus({ url: { status: 'error', text } });
    }

    setTreeData(bookmarks[0].children);
    onCancel();
  };

  const onCancel = () => setOpen(false);
  return (
    <Modal
      top={ top }
      title={ modalTitles[type] }
      open={ open }
      saveText={ type === 'delete' ? '确认' : '保存' }
      onSave={ onSave }
      onCancel={ onCancel }
      formItems={ [
        type === 'add' && (
          <>
            <span>上级目录:</span>
            <input value={ formData.parentTitle } disabled />
          </>
        ),
        type === 'add' && (
          <>
            <span>类型:</span>
            <div className='sona-bookmark-radio-group'>
              <label>
                <input type='radio'
                  name='type'
                  value='directory'
                  checked={ formData.type === 'directory' }
                  onChange={ formChange } />
                <span>目录</span>
              </label>
              <label>
                <input
                  type='radio'
                  name='type'
                  value='bookmark'
                  checked={ formData.type === 'bookmark' }
                  onChange={ formChange }
                />
                <span>书签</span>
              </label>
            </div>
          </>
        ),
        type !== 'delete' && (
          <>
            <span>书签名称:</span>
            <input name='title' value={ formData.title } onChange={ formChange } />
          </>
        ),
        type !== 'delete' && formData.type === 'bookmark' && (
          <>
            <span>书签网址:</span>
            <span style={ { color: 'red', marginLeft: 4 } }>{ formStatus.url.text }</span>
            <input
              className={ formStatus.url.status === 'error' ? 'sona-bookmark-input-empty' : '' }
              name='url'
              value={ formData.url }
              onChange={ formChange }
            />
          </>
        ),
        type === 'delete' && (
          <>
            <span>{ formData.type === 'directory' ? '将删除所有子目录和书签' : '将删除书签' }</span>
            <b className='line-clamp-1'
              style={ { height: '20px', lineHeight: '20px' } }>
              { formData.title }
            </b>
          </>
        ),
      ] }
    />
  );
};

export default memo(HandleModal);
