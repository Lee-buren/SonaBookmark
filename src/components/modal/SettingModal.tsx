import { type CSSProperties, memo, useContext, useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { ConfigContext, defaultConfig } from '~components/ConfigProvider';
import Form from '~components/form/Form';
import FormActions from '~components/form/FormActions';
import FormItem from '~components/form/FormItem';
import InputNumber from '~components/input/InputNumber';
import Radio from '~components/input/Radio';
import Modal from '~components/modal/Modal';
import { ModalContext } from '~components/modal/ModalProvider';

interface Inputs {
  triggerWidth: number;
  triggerTop: number;
  triggerBottom: number;
  triggerDelay: number;
  width: number;
  bookmarkHeight: number;
  fontSize: number;
  duration: number;
  target: Target;
}

const rules: Rules<Inputs> = {
  triggerWidth: {
    valueAsNumber: true,
    required: '请输入触发宽度',
    min: { value: 1, message: '不能小于 1 px' },
  },
  triggerTop: {
    valueAsNumber: true,
    required: '请输入上边距',
    min: { value: 0, message: '不能小于 0 %' },
    max: { value: 50, message: '不能大于 50 %' },
  },
  triggerBottom: {
    valueAsNumber: true,
    required: '请输入下边距',
    min: { value: 0, message: '不能小于 0 %' },
    max: { value: 50, message: '不能大于 50 %' },
  },
  // triggerDelay: {
  //   valueAsNumber: true,
  //   required: '请输入触发延迟时间',
  //   min: { value: 0, message: '不能小于 0ms' },
  //   max: { value: 3000, message: '不能大于 3000ms' },
  // },
  width: {
    valueAsNumber: true,
    required: '请输入侧边宽度',
    min: { value: 100, message: '不能小于 100 px' },
    max: { value: 480, message: '不能大于 480 px' },
  },
  bookmarkHeight: {
    valueAsNumber: true,
    required: '请输入书签高度',
    min: { value: 20, message: '不能小于 20 px' },
    max: { value: 48, message: '不能大于 48 px' },
  },
  fontSize: {
    valueAsNumber: true,
    required: '请输入字体大小',
    min: { value: 12, message: '不能小于 12 px' },
    max: { value: 24, message: '不能大于 24 px' },
  },
  duration: {
    valueAsNumber: true,
    required: '请输入动画过渡时间',
    min: { value: 0, message: '不能小于 0 ms' },
    max: { value: 1000, message: '不能大于 1000 ms' },
  },
  target: { required: '请选择书签打开方式' },
};

const SettingModal = () => {
  const { config, setConfig } = useContext(ConfigContext);
  const { modal, setModal } = useContext(ModalContext);

  const triggerStyle = useMemo<CSSProperties>(() => {
    const isOpened = modal === 'Setting';

    const { position, triggerWidth, triggerTop, triggerBottom } = config;
    const onRight = position === 'right';
    const prefix = onRight ? '' : '-';
    const borderName = `border${ position.charAt(0).toUpperCase() + position.slice(1) }`;
    return {
      [position]: 0,
      [borderName]: 'none',
      top: `${ triggerTop }%`,
      bottom: `${ triggerBottom }%`,
      width: triggerWidth,
      opacity: +isOpened,
      transform: isOpened ? 'none' : `translateX(${ prefix + (triggerWidth + 20) }px)`,
    };
  }, [ config.position, config.triggerWidth, config.triggerTop, config.triggerBottom, modal ]);

  const { register, handleSubmit, reset, clearErrors, formState: { errors } } = useForm<Inputs>();

  const onReset = () => {
    clearErrors();
    const {
      triggerWidth,
      triggerTop,
      triggerBottom,
      triggerDelay,
      width,
      bookmarkHeight,
      fontSize,
      duration,
      target,
    } = defaultConfig;
    const initialForm = {
      triggerWidth,
      triggerTop,
      triggerBottom,
      triggerDelay,
      width,
      bookmarkHeight,
      fontSize,
      duration,
      target,
    };
    reset(initialForm);
    setConfig(initialForm);
  };

  const onClose = () => {
    clearErrors();
    const { triggerWidth, triggerDelay, width, bookmarkHeight, fontSize, duration, target } = config;
    const form = { triggerWidth, triggerDelay, width, bookmarkHeight, fontSize, duration, target };
    reset(form);
    setModal('');
  };

  const onSubmit: SubmitHandler<Inputs> = (form) => {
    setConfig(form);
  };

  return (
    <>
      <Modal title='设置' open={ modal === 'Setting' } onClose={ onClose }>
        <Form onSubmit={ handleSubmit(onSubmit) }>
          <FormItem
            label={ `触发宽度(${ rules.triggerWidth.min['value'] }~∞)(px):` }
            errors={ errors.triggerWidth }>
            <InputNumber defaultValue={ config.triggerWidth } { ...register('triggerWidth', rules.triggerWidth) } />
          </FormItem>

          <FormItem
            label={ `触发高度(${ rules.triggerTop.min['value'] }~${ rules.triggerTop.max['value'] })(%):` }
            errors={ errors.triggerTop || errors.triggerBottom }>
            <div className='sona-trigger-item'>
              <div>上边距:</div>
              <InputNumber
                step={ 0.1 }
                defaultValue={ config.triggerTop }
                { ...register('triggerTop', rules.triggerTop) } />
            </div>
            <div className='sona-trigger-item'>
              <div>下边距:</div>
              <InputNumber
                step={ 0.1 }
                defaultValue={ config.triggerBottom }
                { ...register('triggerBottom', rules.triggerBottom) } />
            </div>
          </FormItem>

          {/* <FormItem
          label={ `触发延迟(${ rules.triggerDelay.min['value'] }~${ rules.triggerDelay.max['value'] })(ms):` }
          errors={ errors.triggerDelay }>
          <InputNumber defaultValue={ config.triggerDelay } { ...register('triggerDelay', rules.triggerDelay) } />
        </FormItem> */ }

          <FormItem
            label={ `侧边宽度(${ rules.width.min['value'] }~${ rules.width.max['value'] })(px):` }
            errors={ errors.width }>
            <InputNumber defaultValue={ config.width } { ...register('width', rules.width) } />
          </FormItem>

          <FormItem
            label={ `书签高度(${ rules.bookmarkHeight.min['value'] }~${ rules.bookmarkHeight.max['value'] })(px):` }
            errors={ errors.bookmarkHeight }>
            <InputNumber defaultValue={ config.bookmarkHeight } { ...register(
              'bookmarkHeight',
              rules.bookmarkHeight,
            ) } />
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

      <div className='sona-trigger-area' style={ triggerStyle }>
        <div
          className='sona-trigger-area_text'
          style={ {
            [config.position]: config.triggerWidth,
            borderRadius: config.position === 'right' ? '4px 0 0 4px' : '0 4px 4px 0',
          } }>
          触发区域
        </div>
      </div>
    </>
  );
};

export default memo(SettingModal);

