import { EllipsisOutlined } from '@ant-design/icons';
import { Input, message } from 'antd';
import React from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import {
  asyncDispatch,
  asyncRenameFragmentColumn,
  EFragmentActionError,
} from '../../redux/actions';

import styles from '../../styles/FragmentColumn.module.scss';

interface IFragmentColumnHeaderProps {
  title: string;
  dragHandle?: DraggableProvidedDragHandleProps;
}

enum EMode {
  INPUT,
  TEXT,
}

const FragmentColumnHeader: React.FC<IFragmentColumnHeaderProps> = React.memo(
  (props) => {
    const { title, dragHandle } = props;
    const [mode, setMode] = React.useState(EMode.TEXT);
    const inputRef = React.useRef<Input>(null);
    const { formatMessage: f } = useIntl();
    const dispatch = useDispatch();
    const setInputMode = () => setMode(EMode.INPUT);
    const setTextMode = () => setMode(EMode.TEXT);
    const handleTitleBlur = () => {
      inputRef.current?.setValue(title);
      setTextMode();
    };
    // const a = useSelector((state: IReduxState) => state.fragment.columns);
    const handleTitleSubmit = () => {
      const newTitle = inputRef.current?.state.value;
      if (!newTitle || newTitle === title) {
        return;
      }
      asyncDispatch(dispatch, asyncRenameFragmentColumn(title, newTitle)).catch(
        (error: EFragmentActionError) => {
          switch (error) {
            case EFragmentActionError.EXISTED_ARCHIVE:
            case EFragmentActionError.EXISTED_DIRECTORY:
            case EFragmentActionError.EXISTED_FILE:
              message.error(f({ id: 'aColumnWithTheSameTitleAlreadyExists' }));
              break;
            default:
              break;
          }
        }
      );
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
            {title}
          </div>
          <Input
            ref={inputRef}
            className={styles.input}
            defaultValue={title}
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
);

export default FragmentColumnHeader;
