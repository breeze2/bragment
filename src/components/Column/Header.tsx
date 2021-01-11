import { DownOutlined } from '@ant-design/icons';
import { Input, message } from 'antd';
import classnames from 'classnames';
import {
  forwardRef,
  memo,
  ChangeEvent as ReactChangeEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { useIntl } from 'react-intl';
import { IColumn } from '../../api/types';
import { columnThunks, useReduxAsyncDispatch } from '../../redux';
import { EReduxThunkErrorMessage } from '../../redux/types';

import styles from '../../styles/Column.module.scss';

interface IColumnHeaderProps {
  data: IColumn;
  dragHandle?: DraggableProvidedDragHandleProps;
}

enum EMode {
  INPUT,
  TEXT,
}

const ColumnHeader = forwardRef<HTMLDivElement, IColumnHeaderProps>(
  (props, ref) => {
    const { data, dragHandle } = props;
    const { formatMessage: f } = useIntl();
    const inputRef = useRef<Input>(null);
    const [newTitle, setNewTitle] = useState(data.title);
    const [mode, setMode] = useState(EMode.TEXT);
    const asyncDispatch = useReduxAsyncDispatch();
    const setInputMode = () => setMode(EMode.INPUT);
    const setTextMode = () => setMode(EMode.TEXT);

    const handleInputSubmit = () => {
      const title = newTitle.trim();
      if (!data.id || !title || title === data.title) {
        setTextMode();
        return;
      }

      //TODO: check title unique
      asyncDispatch(
        columnThunks.rename({
          id: data.id,
          title,
        })
      ).catch((error) => {
        switch (error.message) {
          case EReduxThunkErrorMessage.EXISTED_COLUMN:
            message.error(f({ id: 'columnWithTheSameTitleAlreadyExists' }));
            break;
          default:
            break;
        }
      });
      setTextMode();
    };

    const handleInputBlur = () => {
      setTextMode();
    };

    const handleInputChange = (event: ReactChangeEvent<HTMLInputElement>) => {
      setNewTitle(event.target.value);
    };

    const handleInputKeyDown = (
      event: ReactKeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === 'Escape') {
        setTextMode();
      }
    };

    useLayoutEffect(() => {
      if (mode === EMode.INPUT) {
        setNewTitle(data.title);
        inputRef.current?.focus();
      }
    }, [data, mode]);
    console.info('ColumnHeader rendering...');
    return (
      <div ref={ref} className={styles.header} {...dragHandle}>
        <div
          className={classnames(
            styles.title,
            mode === EMode.INPUT ? styles.inputMode : styles.textMode
          )}>
          <div className={styles.text} onClick={setInputMode}>
            {data.title}
          </div>
          <Input
            ref={inputRef}
            value={newTitle}
            className={styles.input}
            defaultValue={data.title}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onPressEnter={handleInputSubmit}
            onKeyDown={handleInputKeyDown}
          />
        </div>
        <div className={styles.addon}>
          <DownOutlined />
        </div>
      </div>
    );
  }
);

export default memo(ColumnHeader);