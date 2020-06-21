import { EllipsisOutlined } from '@ant-design/icons';
import { Input, message } from 'antd';
import React, { memo } from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { IFragmentColumn } from '../../api/types';
import {
  asyncDispatch,
  asyncRenameFragmentColumn,
  EFragmentActionError,
} from '../../redux/actions';

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
  const inputRef = React.useRef<Input>(null);
  const [mode, setMode] = React.useState(EMode.TEXT);
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const setInputMode = () => setMode(EMode.INPUT);
  const setTextMode = () => setMode(EMode.TEXT);

  const handleTitleBlur = () => {
    inputRef.current?.setValue(data.title);
    setTextMode();
  };

  const handleTitleSubmit = () => {
    const newTitle = inputRef.current?.state.value;
    if (!data.id || !newTitle || newTitle === data.title) {
      return;
    }
    asyncDispatch(
      dispatch,
      asyncRenameFragmentColumn(data.id, String.prototype.trim.call(newTitle))
    ).catch((error: EFragmentActionError) => {
      switch (error) {
        case EFragmentActionError.EXISTED_ARCHIVE:
        case EFragmentActionError.EXISTED_DIRECTORY:
        case EFragmentActionError.EXISTED_FILE:
          message.error(f({ id: 'columnWithTheSameTitleAlreadyExists' }));
          break;
        default:
          break;
      }
    });
  };
  React.useLayoutEffect(() => {
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
        />
      </div>
      <div className={styles.addon}>
        <EllipsisOutlined />
      </div>
    </div>
  );
}

export default memo(FragmentColumnHeader);
