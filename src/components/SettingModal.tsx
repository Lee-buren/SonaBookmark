import type { ChangeEvent } from 'react';
import { useContext, useEffect, useState } from 'react';
import { ConfigContext, defaultConfig } from '~components/ConfigProvider';
import Modal from '~components/Modal';

// 默认表单数据, 重置时使用
const initialForm = {
  triggerWidth: defaultConfig.triggerWidth,
  width: defaultConfig.width,
  bookmarkHeight: defaultConfig.bookmarkHeight,
  fontSize: defaultConfig.fontSize,
  duration: defaultConfig.duration,
  target: defaultConfig.target,
};

interface Props {
  open: boolean;
  setOpen: Setter<boolean>;
}

const SettingModal = ({ open, setOpen }: Props) => {
  const { config, setConfig } = useContext(ConfigContext);
  const [ form, setForm ] = useState<SettingForm>(initialForm);
  useEffect(() => {
    const { triggerWidth, width, bookmarkHeight, fontSize, duration, target } = config;
    setForm({ triggerWidth, width, bookmarkHeight, fontSize, duration, target });
  }, [ config ]);

  const formChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'target' ? value : +value });
  };

  const formRules = {
    triggerWidth: { min: 1, max: 64 },
    width: { min: 100, max: 480 },
    bookmarkHeight: { min: 12, max: 30 },
    fontSize: { min: 12, max: 24 },
    duration: { min: 0, max: 1000 },
  };
  const formBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const { min, max } = formRules[name];
    value < min && setForm({ ...form, [name]: min });
    value > max && setForm({ ...form, [name]: max });
  };

  const onSave = () => setConfig({ ...config, ...form });
  const onCancel = () => setOpen(false);
  const onReset = () => setForm(initialForm);
  return (
    <Modal title='设置'
      open={ open }
      onSave={ onSave }
      onCancel={ onCancel }
      extraButtons={ [ <button onClick={ onReset }>重置</button> ] }
      formItems={ [
        <>
          <span>触发宽度({ formRules.triggerWidth.min }-{ formRules.triggerWidth.max })(px):</span>
          <input type='number'
            name='triggerWidth'
            min={ formRules.triggerWidth.min }
            max={ formRules.triggerWidth.max }
            value={ form.triggerWidth }
            onChange={ formChange }
            onBlur={ formBlur } />
        </>,
        <>
          <span>侧边宽度({ formRules.width.min }-{ formRules.width.max })(px):</span>
          <input type='number'
            name='width'
            min={ formRules.width.min }
            max={ formRules.width.max }
            value={ form.width }
            onChange={ formChange }
            onBlur={ formBlur } />
        </>,
        <>
          <span>书签高度({ formRules.bookmarkHeight.min }-{ formRules.bookmarkHeight.max })(px):</span>
          <input type='number'
            name='bookmarkHeight'
            min={ formRules.bookmarkHeight.min }
            max={ formRules.bookmarkHeight.max }
            value={ form.bookmarkHeight }
            onChange={ formChange }
            onBlur={ formBlur } />
        </>,
        <>
          <span>字体大小({ formRules.fontSize.min }-{ formRules.fontSize.max })(px):</span>
          <input type='number'
            name='fontSize'
            min={ formRules.fontSize.min }
            max={ formRules.fontSize.max }
            value={ form.fontSize }
            onChange={ formChange }
            onBlur={ formBlur } />
        </>,
        <>
          <span>动画过渡时间({ formRules.duration.min }-{ formRules.duration.max })(ms):</span>
          <input type='number'
            name='duration'
            min={ formRules.duration.min }
            max={ formRules.duration.max }
            value={ form.duration }
            onChange={ formChange }
            onBlur={ formBlur } />
        </>,
        <>
          <span>书签打开方式:</span>
          <div className='sona-bookmark-radio-group'>
            <label>
              <input type='radio'
                name='target'
                value='_self'
                checked={ form.target === '_self' }
                onChange={ formChange } />
              <span>当前页</span>
            </label>
            <label>
              <input type='radio'
                name='target'
                value='_blank'
                checked={ form.target === '_blank' }
                onChange={ formChange } />
              <span>新页</span>
            </label>
          </div>
        </>,
      ] } />
  );
};

export default SettingModal;
