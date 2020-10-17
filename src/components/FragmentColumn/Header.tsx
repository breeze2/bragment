import { EllipsisOutlined } from '@ant-design/icons';
import { Input, message } from 'antd';
import React, {
  memo,
  KeyboardEvent as ReactKeyboardEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { useIntl } from 'react-intl';
import { IFragmentColumn } from '../../api/types';
import { fragmentColumnThunks, useReduxAsyncDispatch } from '../../redux';
import { EFragmentThunkErrorMessage } from '../../redux/types';

import styles from '../../styles/FragmentColumn.module.scss';

interface IFragmentColumnHeaderProps {
  data: IFragmentColumn;
  dragHandle?: DraggableProvidedDragHandleProps;
}

enum EMode {
  INPUT,
  TEXT,
}

function FragmentColumnHeader(props: IFragmentColumnHeaderProps) {
  const { data, dragHandle } = props;
  const { formatMessage: f } = useIntl();
  const inputRef = useRef<Input>(null);
  const [mode, setMode] = useState(EMode.TEXT);
  const asyncDispatch = useReduxAsyncDispatch();
  const setInputMode = () => setMode(EMode.INPUT);
  const setTextMode = () => setMode(EMode.TEXT);

  const handleTitleSubmit = () => {
    const newTitle = (inputRef.current?.state?.value || '').trim();
    if (!data.id || !newTitle || newTitle === data.title) {
      setTextMode();
      return;
    }

    //TODO: check title unique
    asyncDispatch(
      fragmentColumnThunks.rename({
        id: data.id,
        title: String.prototype.trim.call(newTitle),
      })
    ).catch((error) => {
      inputRef.current?.setValue(data.title);
      switch (error.message) {
        case EFragmentThunkErrorMessage.EXISTED_COLUMN:
          message.error(f({ id: 'columnWithTheSameTitleAlreadyExists' }));
          break;
        default:
          break;
      }
    });
    setTextMode();
  };

  const handleTitleBlur = () => {
    inputRef.current?.setValue(data.title);
    setTextMode();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      inputRef.current?.setValue(data.title);
      setTextMode();
    }
  };

  useLayoutEffect(() => {
    if (mode === EMode.INPUT) {
      inputRef.current?.focus();
    }
  }, [mode]);
  console.info('FragmentColumnHeader rendering...');
  return (
    <div className={styles.header} {...dragHandle}>
      <div
        className={`${styles.title} ${
          mode === EMode.INPUT ? styles.inputMode : styles.textMode
        }`}>
        <div className={styles.text} onClick={setInputMode}>
          {data.title}
        </div>
        <Input
          ref={inputRef}
          className={styles.input}
          defaultValue={data.title}
          onBlur={handleTitleBlur}
          onPressEnter={handleTitleSubmit}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles.addon}>
        <EllipsisOutlined />
      </div>
    </div>
  );
}

export default memo(FragmentColumnHeader);
