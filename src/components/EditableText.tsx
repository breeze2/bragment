import { Input } from 'antd';
import React from 'react';

import styles from '../styles/EditableText.module.scss';

export interface IEditableTextProps {
  defaultValue: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export enum EEditableTextStatus {
  NORMAL,
  EDITING,
}

const EditableText: React.FC<IEditableTextProps> = React.memo(props => {
  const [status, setStatus] = React.useState<EEditableTextStatus>(
    EEditableTextStatus.NORMAL
  );
  const [value, setValue] = React.useState(props.defaultValue);
  const inputRef = React.useRef<Input>(null);
  const handleTextClick = () => {
    setValue(props.defaultValue);
    setStatus(EEditableTextStatus.EDITING);
  };
  const handleInputBlur = () => {
    if (props.onChange) {
      props.onChange(value);
    }
    setStatus(EEditableTextStatus.NORMAL);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      setValue(target.value);
    }
  };
  React.useLayoutEffect(() => {
    if (status === EEditableTextStatus.EDITING) {
      inputRef.current?.focus();
    }
  }, [status]);
  return (
    <div
      className={`${styles.wrapper} ${
        status === EEditableTextStatus.NORMAL
          ? styles.showText
          : styles.showInput
      }`}>
      <p onClick={handleTextClick} className={styles.text}>
        {props.defaultValue}
      </p>
      <Input
        ref={inputRef}
        className={styles.input}
        value={value}
        placeholder={props.placeholder}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
      />
    </div>
  );
});

export default EditableText;
