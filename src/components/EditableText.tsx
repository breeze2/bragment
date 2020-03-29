import { Input } from 'antd';
import React from 'react';

import styles from '../styles/EditableText.module.scss';

export interface IEditableTextProps {
  defaultValue?: string;
  inputValue?: string;
  textValue?: string | React.ReactNode;
  className?: string;
  placeholder?: string;
  editAddon?: React.ReactNode;
  onChange?: (value: string) => void;
}

export enum EEditableTextStatus {
  NORMAL,
  EDITING,
}

const EditableText: React.FC<IEditableTextProps> = React.memo((props) => {
  const defaultInputValue = props.inputValue || props.defaultValue || '';
  const [status, setStatus] = React.useState<EEditableTextStatus>(
    EEditableTextStatus.NORMAL
  );
  const [inputValue, setInputValue] = React.useState(defaultInputValue);
  const inputRef = React.useRef<Input>(null);
  const handleTextClick = () => {
    setInputValue(defaultInputValue);
    setStatus(EEditableTextStatus.EDITING);
  };
  const handleInputBlur = () => {
    if (props.onChange && inputValue !== defaultInputValue) {
      props.onChange(inputValue);
    }
    setStatus(EEditableTextStatus.NORMAL);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      setInputValue(target.value);
    }
  };
  React.useLayoutEffect(() => {
    if (status === EEditableTextStatus.EDITING) {
      inputRef.current?.focus();
    }
  }, [status]);
  return (
    <div
      className={`${styles.wrapper} ${props.className} ${
        status === EEditableTextStatus.NORMAL
          ? styles.showText
          : styles.showInput
      }`}>
      <p onClick={handleTextClick} className={styles.text}>
        {props.textValue || props.defaultValue}
      </p>
      <Input
        ref={inputRef}
        className={styles.input}
        value={inputValue}
        placeholder={props.placeholder}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
      />
      <div className={styles.editAddon}>{props.editAddon}</div>
    </div>
  );
});

export default EditableText;
