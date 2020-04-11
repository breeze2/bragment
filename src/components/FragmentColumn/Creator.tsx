import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { asyncCreateFragmentColumn, asyncDispatch } from '../../redux/actions';
import { IReduxState } from '../../redux/types';

import styles from '../../styles/FragmentColumn.module.scss';

export interface IFragmentColumnCreatorProps {}

enum EMode {
  FIELD,
  LABEL,
}

const FragmentColumnCreator: React.FC<IFragmentColumnCreatorProps> = React.memo(
  (props) => {
    const { formatMessage: f } = useIntl();
    const dispatch = useDispatch();
    const [mode, setMode] = React.useState(EMode.LABEL);
    const [submitting, setSubmitting] = React.useState(false);
    const selfRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<Input>(null);
    const currentBoard = useSelector((state: IReduxState) =>
      state.board.get('current')
    );
    const setFieldMode = () => setMode(EMode.FIELD);
    const setLabelMode = () => setMode(EMode.LABEL);
    const handleSubmit = () => {
      const title = inputRef.current?.state.value;
      if (!currentBoard || !title) {
        return;
      }
      setSubmitting(true);
      asyncDispatch(dispatch, asyncCreateFragmentColumn(currentBoard, title))
        .catch(() => {
          // EXCEPTION:
        })
        .finally(() => {
          inputRef.current?.setValue('');
          setLabelMode();
          setSubmitting(false);
        });
    };

    React.useLayoutEffect(() => {
      if (mode === EMode.FIELD) {
        inputRef.current?.focus();
        const handleBodyMouseUp = (event: MouseEvent) => {
          if (
            event.target instanceof Node &&
            selfRef.current?.contains(event.target)
          ) {
            return;
          }
          setLabelMode();
        };
        document.body.addEventListener('mouseup', handleBodyMouseUp);
        return () => {
          document.body.removeEventListener('mouseup', handleBodyMouseUp);
        };
      }
    }, [mode]);
    console.info('FragmentColumnCreator rendering...');
    return (
      <div
        ref={selfRef}
        className={`${styles.creator} ${
          mode === EMode.FIELD ? styles.fieldMode : styles.labelMode
        }`}>
        <div className={styles.label} onClick={setFieldMode}>
          <PlusOutlined /> {f({ id: 'addAnotherColumn' })}
        </div>
        <div className={styles.field}>
          <Input
            ref={inputRef}
            placeholder={f({ id: 'inputColumnTitle' })}
            onPressEnter={handleSubmit}
          />
          <div className={styles.actions}>
            <Button type="primary" loading={submitting} onClick={handleSubmit}>
              {f({ id: 'addColumn' })}
            </Button>
            <CloseOutlined
              style={{ display: submitting ? 'none' : undefined }}
              className={styles.close}
              onClick={setLabelMode}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default FragmentColumnCreator;
