import { sendToBackground } from '@plasmohq/messaging';
import { useUpdateEffect } from 'ahooks';
import { type CSSProperties, forwardRef, useContext } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import Form from '~components/form/Form';
import FormActions from '~components/form/FormActions';
import FormItem from '~components/form/FormItem';
import Input from '~components/input/Input';
import Radio from '~components/input/Radio';
import Modal from '~components/modal/Modal';
import { ModalContext } from '~components/modal/ModalProvider';
import type { HandleType } from '~components/tree/BookmarkTree';

interface IProps {
  type: HandleType;
  form: HandleForm;
  setTree: Setter<BookmarkTreeNode[]>;
  style?: CSSProperties;
}

type ModalTitles = {
  [x in HandleType]: string;
};

const modalTitles: ModalTitles = {
  add: '新增',
  edit: '编辑',
  delete: '删除',
};

interface Inputs {
  type: BookmarkType;
  title: string;
  url: string;
}

const rules: Rules<Inputs> = {
  type: { required: '请选择类型' },
  url: {
    validate: (value, formValues) => {
      if (formValues.type === 'bookmark' && value === '') return '请输入URL';
    },
  },
};

const HandleModal = forwardRef<HTMLDivElement, IProps>(({ type, form, setTree, style }, ref) => {
  const { modal, setModal } = useContext(ModalContext);
  const { register, handleSubmit, setValue, setError, clearErrors, watch, formState: { errors } } = useForm<Inputs>();

  const bookmarkType = watch('type');
  useUpdateEffect(() => {
    clearErrors();
    setValue('url', '');
  }, [ bookmarkType ]);

  useUpdateEffect(() => {
    for (const [ key, val ] of Object.entries(form)) {
      if ([ 'type', 'title', 'url' ].includes(key)) {
        setValue(key as keyof Inputs, val);
      }
    }
  }, [ form ]);

  const onClose = () => setModal('');

  const onSubmit: SubmitHandler<Inputs> = async ({ title, url }) => {
    const { parentId, id } = form;

    const { bookmarks, error } = await sendToBackground({
      name: 'bookmarks',
      body: {
        action: type,
        data: { parentId, id, title, url: bookmarkType === 'bookmark' ? url : '' },
      },
    });

    if (error) {
      const message = error.includes('Invalid URL') ? '无效网址' : error;
      return setError('url', { message });
    }

    setTree(bookmarks[0].children);
    onClose();
  };

  return (
    <Modal ref={ ref } style={ style } title={ modalTitles[type] } open={ modal === 'Handle' } onClose={ onClose }>
      <Form onSubmit={ handleSubmit(onSubmit) }>
        { type === 'add' && (
          <>
            <FormItem label='目录:'>
              <input value={ form.parentTitle } disabled />
            </FormItem>
            <FormItem label='类型:' errors={ errors.type }>
              <Radio
                defaultValue={ form.type }
                options={ [
                  { label: '目录', value: 'directory' },
                  { label: '书签', value: 'bookmark' },
                ] }
                { ...register('type', rules.type) } />
            </FormItem>
          </>
        ) }

        { type !== 'delete' ? (
          <FormItem label='名称:'>
            <Input defaultValue={ form.title } { ...register('title') } />
          </FormItem>
        ) : (
          <FormItem label={ form.type === 'directory' ? '将删除目录(及子目录和书签)' : '将删除书签' }>
            <b className='line-clamp-1'>
              { form.title }
            </b>
          </FormItem>
        ) }

        { type !== 'delete' && (
          <FormItem label='网址:' errors={ errors.url }>
            <Input
              defaultValue={ form.url }
              { ...register('url', rules.url) }
              disabled={ bookmarkType !== 'bookmark' } />
          </FormItem>
        ) }

        <FormActions>
          <button type='button' onClick={ onClose }>取消</button>
          <button type='submit'>{ type === 'delete' ? '确认' : '保存' }</button>
        </FormActions>
      </Form>
    </Modal>
  );
});

export default HandleModal;
