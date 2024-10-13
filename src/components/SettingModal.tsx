import { type ChangeEvent, type Dispatch, type SetStateAction, useContext, useEffect, useState } from 'react';
import { ConfigContext, defaultConfig } from '~components/ConfigProvider';
import Modal from '~components/Modal';

// 默认表单数据, 重置时使用
const initialConfig = {
  width: defaultConfig.width,
  fontSize: defaultConfig.fontSize,
  triggerWidth: defaultConfig.triggerWidth,
  bookmarkHeight: defaultConfig.bookmarkHeight,
  target: defaultConfig.target,
  duration: defaultConfig.duration,
};

interface Form {
  width: number;
  fontSize: number;
  triggerWidth: number;
  bookmarkHeight: number;
  target: '_self' | '_blank';
  duration: number;
}

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const SettingModal = ({ open, setOpen }: Props) => {
  const { config, setConfig } = useContext(ConfigContext);
  const [ form, setForm ] = useState<Form>(initialConfig);
  useEffect(() => {
    const { width, fontSize, triggerWidth, bookmarkHeight, target, duration } = config;
    setForm({ width, fontSize, triggerWidth, bookmarkHeight, target, duration });
  }, [ config ]);
  // 表单数据验证规则
  const formRules = {
    triggerWidth: { min: 1, max: 64 },
    width: { min: 100, max: 480 },
    fontSize: { min: 12, max: 24 },
    bookmarkHeight: { min: 12, max: 30 },
    duration: { min: 0, max: 1000 },
  };
  const formChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'target') {
      setForm({ ...form, [name]: value as '_self' | '_blank' });
      return;
    }
    setForm({ ...form, [name]: parseInt(value) || 0 });
  };
  const formBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const { min, max } = formRules[name];
    if (value === '' || isNaN(parseInt(value)) || value < min) {
      // 输入值不合法, 置为最小值
      setForm({ ...form, [name]: min });
    } else if (value > max) {
      // 输入值超过最大值, 置为最大值
      setForm({ ...form, [name]: max });
    } else {
      setForm({ ...form, [name]: parseInt(value) });
    }
  };
  const onSave = () => setConfig({ ...config, ...form });
  const onCancel = () => setOpen(false);
  const onReset = () => setForm(initialConfig);
  return (
    <Modal title='设置'
      open={ open }
      onSave={ onSave }
      onCancel={ onCancel }
      extraButtons={ [ <button onClick={ onReset }>重置</button> ] }
      formItems={ [
        <>
          <span>触发宽度(px)({ formRules.triggerWidth.min }-{ formRules.triggerWidth.max }):</span>
          <input type='number'
            name='triggerWidth'
            value={ form.triggerWidth }
            onChange={ formChange }
            onBlur={ formBlur } />
        </>,
        <>
          <span>侧边宽度(px)({ formRules.width.min }-{ formRules.width.max }):</span>
          <input type='number' name='width' value={ form.width } onChange={ formChange } onBlur={ formBlur } />
        </>,
        <>
          <span>字体大小(px)({ formRules.fontSize.min }-{ formRules.fontSize.max }):</span>
          <input type='number' name='fontSize' value={ form.fontSize } onChange={ formChange } onBlur={ formBlur } />
        </>,
        <>
          <span>书签高度(px)({ formRules.bookmarkHeight.min }-{ formRules.bookmarkHeight.max }):</span>
          <input type='number'
            name='bookmarkHeight'
            value={ form.bookmarkHeight }
            onChange={ formChange }
            onBlur={ formBlur } />
        </>,
        <>
          <span>动画过渡时间(ms)({ formRules.duration.min }-{ formRules.duration.max }):</span>
          <input type='number' name='duration' value={ form.duration } onChange={ formChange } onBlur={ formBlur } />
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
