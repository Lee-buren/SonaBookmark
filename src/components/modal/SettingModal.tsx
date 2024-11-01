import { memo, useContext } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { ConfigContext, defaultConfig } from '~components/ConfigProvider';
import Form from '~components/form/Form';
import FormActions from '~components/form/FormActions';
import FormItem from '~components/form/FormItem';
import InputNumber from '~components/input/InputNumber';
import Radio from '~components/input/Radio';
import Modal from '~components/modal/Modal';
import { ModalContext } from '~components/modal/ModalProvider';

interface Inputs {
  triggerWidth: string;
  width: string;
  bookmarkHeight: string;
  fontSize: string;
  duration: string;
  target: Target;
}

const rules: Rules<Inputs> = {
  triggerWidth: {
    min: { value: 1, message: '不能小于 1px' },
    required: '请输入触发宽度',
  },
  width: {
    min: { value: 100, message: '不能小于 100px' },
    max: { value: 480, message: '不能大于 480px' },
    required: '请输入侧边宽度',
  },
  bookmarkHeight: {
    min: { value: 20, message: '不能小于 20px' },
    max: { value: 48, message: '不能大于 48px' },
    required: '请输入书签高度',
  },
  fontSize: {
    min: { value: 12, message: '不能小于 12px' },
    max: { value: 24, message: '不能大于 24px' },
    required: '请输入字体大小',
  },
  duration: {
    min: { value: 0, message: '不能小于 0ms' },
    max: { value: 1000, message: '不能大于 1000ms' },
    required: '请输入动画过渡时间',
  },
  target: { required: '请选择书签打开方式' },
};

const SettingModal = () => {
  const { config, setConfig } = useContext(ConfigContext);
  const { modal, setModal } = useContext(ModalContext);

  const { register, handleSubmit, setValue, clearErrors, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (form) => setConfig(form);

  const onClose = () => setModal('');

  const onReset = () => {
    clearErrors();
    const { triggerWidth, width, bookmarkHeight, fontSize, duration, target } = defaultConfig;
    const initialForm = { triggerWidth, width, bookmarkHeight, fontSize, duration, target };
    for (const [ key, val ] of Object.entries(initialForm)) {
      setValue(key as keyof typeof initialForm, val);
    }
    setConfig(initialForm);
  };

  return (
    <Modal title='设置' open={ modal === 'Setting' } onClose={ onClose }>
      <Form onSubmit={ handleSubmit(onSubmit) }>
        <FormItem
          label={ `触发宽度(${ rules.triggerWidth.min['value'] }~∞)(px):` }
          errors={ errors.triggerWidth }>
          <InputNumber defaultValue={ config.triggerWidth } { ...register('triggerWidth', rules.triggerWidth) } />
        </FormItem>

        <FormItem
          label={ `侧边宽度(${ rules.width.min['value'] }~${ rules.width.max['value'] })(px):` }
          errors={ errors.width }>
          <InputNumber defaultValue={ config.width } { ...register('width', rules.width) } />
        </FormItem>

        <FormItem
          label={ `书签高度(${ rules.bookmarkHeight.min['value'] }~${ rules.bookmarkHeight.max['value'] })(px):` }
          errors={ errors.bookmarkHeight }>
          <InputNumber defaultValue={ config.bookmarkHeight } { ...register('bookmarkHeight', rules.bookmarkHeight) } />
        </FormItem>

        <FormItem
          label={ `字体大小(${ rules.fontSize.min['value'] }~${ rules.fontSize.max['value'] })(px):` }
          errors={ errors.fontSize }>
          <InputNumber defaultValue={ config.fontSize } { ...register('fontSize', rules.fontSize) } />
        </FormItem>

        <FormItem
          label={ `动画时间(${ rules.duration.min['value'] }~${ rules.duration.max['value'] })(ms):` }
          errors={ errors.duration }>
          <InputNumber defaultValue={ config.duration } { ...register('duration', rules.duration) } />
        </FormItem>

        <FormItem label='书签打开方式:' errors={ errors.target }>
          <Radio
            defaultValue={ config.target }
            options={ [
              { label: '当前页', value: '_self' },
              { label: '新标签页', value: '_blank' },
            ] }
            { ...register('target', rules.target) } />
        </FormItem>

        <FormActions>
          <button type='button' onClick={ onReset }>重置</button>
          <button type='button' onClick={ onClose }>取消</button>
          <button type='submit'>保存</button>
        </FormActions>
      </Form>
    </Modal>
  );
};

export default memo(SettingModal);

