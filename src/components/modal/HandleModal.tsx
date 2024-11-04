import { sendToBackground } from '@plasmohq/messaging';
import { useKeyPress, useUpdateEffect } from 'ahooks';
import { type ChangeEvent, type CSSProperties, forwardRef, memo, useContext, useRef } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import Folder from 'react:assets/Folder.svg';
import Form from '~components/form/Form';
import FormActions from '~components/form/FormActions';
import FormItem from '~components/form/FormItem';
import Input from '~components/input/Input';
import Radio from '~components/input/Radio';
import Modal from '~components/modal/Modal';
import { ModalContext } from '~components/modal/ModalProvider';
import type { HandleType } from '~components/tree/BookmarkTree';
import { getFavicon } from '~utils/tools';

interface IProps {
  style?: CSSProperties;
  type: HandleType;
  form: HandleForm;
  setTree: Setter<BookmarkTreeNode[]>;
}

interface Inputs {
  type: BookmarkType;
  title: string;
  url: string;
  inset: 'top' | 'bottom';
}

type ModalTitles = {
  [x in HandleType]: string;
};

const modalTitles: ModalTitles = {
  add: '新增',
  edit: '编辑',
  delete: '删除(回车快速删除)',
};

const rules: Rules<Inputs> = {
  type: { required: '请选择类型' },
  url: {
    validate: (value, formValues) => {
      if (formValues.type === 'bookmark' && value === '') return '请输入网址';
    },
  },
};

const HandleModal = forwardRef<HTMLDivElement, IProps>((props, ref) => {
  const { style, type, form, setTree } = props;
  const { modal, setModal } = useContext(ModalContext);
  const formRef = useRef<HTMLFormElement>();

  const { register, handleSubmit, reset, setValue, setError, clearErrors, watch, formState } = useForm<Inputs>();
  const typeRegister = register('type', rules.type);
  const bookmarkType = watch('type');
  const typeChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearErrors();
    typeRegister.onChange(e);

    if (e.target.value === 'bookmark') return;
    setValue('url', '');
  };

  useUpdateEffect(() => {
    clearErrors();
    reset(form);
  }, [ form ]);

  useKeyPress('enter', () => {
    if (type !== 'delete') return;
    onSubmit({ ...form, inset: 'bottom' });
  });

  const onClose = () => {
    // 回车提交不会使input失焦, 手动实现
    const inputEls = formRef.current.querySelectorAll('input');
    inputEls.forEach((el) => el.blur());

    setModal('');
  };

  const onSubmit: SubmitHandler<Inputs> = async ({ title, url, inset }) => {
    const { parentId, id } = form;

    url = bookmarkType === 'bookmark' ? url : '';
    const index = inset === 'top' ? 0 : null;
    const { bookmarks, error } = await sendToBackground({
      name: 'bookmarks',
      body: { action: type, data: { parentId, id, title, url, index } },
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
      <Form ref={ formRef } onSubmit={ handleSubmit(onSubmit) }>
        { type === 'add' && (
          <>
            <FormItem label='目录:'>
              <input value={ form.parentTitle } disabled />
            </FormItem>
            <FormItem label='类型:' errors={ formState.errors.type }>
              <Radio
                options={ [
                  { label: '目录', value: 'directory' },
                  { label: '书签', value: 'bookmark' },
                ] }
                { ...typeRegister }
                onChange={ typeChange }
              />
            </FormItem>
          </>
        ) }

        { type !== 'delete' ? (
          <>
            <FormItem label='名称:'>
              <Input { ...register('title') } placeholder='请输入名称(可以为空)' />
            </FormItem>
          </>
        ) : (
          <FormItem label={ form.type === 'directory' ? '将删除该目录(及子目录和书签)' : '将删除该书签' }>
            <div style={ { display: 'flex', alignItems: 'center', gap: '2px', height: '20px' } } title={ form.title }>
              { form.url ?
                (<img
                  style={ { display: 'block' } }
                  width={ 14 }
                  height={ 14 }
                  src={ getFavicon(form.url) }
                  alt={ form.url } />) :
                (<Folder width={ 14 } height={ 14 } />) }
              <b className='line-clamp-1'>
                { form.title }
              </b>
            </div>
          </FormItem>
        ) }

        { (type === 'add' || (type === 'edit' && bookmarkType === 'bookmark')) && (
          <FormItem label='网址:' errors={ formState.errors.url }>
            <Input
              { ...register('url', rules.url) }
              placeholder={ bookmarkType === 'directory' ? '目录不填写' : '请输入网址' }
              disabled={ bookmarkType !== 'bookmark' } />
          </FormItem>
        ) }

        { type === 'add' && (
          <FormItem label='插入位置:'>
            <Radio
              defaultValue='bottom'
              options={ [
                { label: '头部', value: 'top' },
                { label: '尾部', value: 'bottom' },
              ] }
              { ...register('inset') }
            />
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

export default memo(HandleModal);
