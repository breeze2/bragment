import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { EFragmentType } from '../../api/types';
import { asyncCreateFragment, asyncDispatch } from '../../redux/actions';
import { IReduxState } from '../../redux/types';

import styles from '../../styles/FragmentColumn.module.scss';

export enum EMode {
  FIELD,
  LABEL,
}

interface IFragmentColumnFooterProps {
  id: string;
  onModeChange?: (mode: EMode) => void;
}

const FragmentColumnFooter: React.FC<IFragmentColumnFooterProps> = React.memo(
  (props) => {
    const { id, onModeChange } = props;
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
      asyncDispatch(
        dispatch,
        asyncCreateFragment(currentBoard, id, title, EFragmentType.GIST, [])
      )
        .catch(() => {
          // EXCEPTION:
        })
        .finally(() => {
          inputRef.current?.setValue('');
          setSubmitting(false);
          setLabelMode();
        });
    };
    React.useLayoutEffect(() => {
      if (onModeChange) {
        onModeChange(mode);
      }
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
    }, [mode, onModeChange]);
    console.info('FragmentColumnFooter rendering...');
    return (
      <div ref={selfRef} className={styles.footer}>
        <div
          className={`${styles.creator} ${
            mode === EMode.FIELD ? styles.fieldMode : styles.labelMode
          }`}>
          <div className={styles.label} onClick={setFieldMode}>
            <PlusOutlined /> {f({ id: 'addAnotherCard' })}
          </div>
          <div className={styles.field}>
            <Input
              ref={inputRef}
              placeholder={f({ id: 'inputCardTitle' })}
              onPressEnter={handleSubmit}
            />
            <div className={styles.actions}>
              <Button
                type="primary"
                loading={submitting}
                onClick={handleSubmit}>
                {f({ id: 'addCard' })}
              </Button>
              <CloseOutlined
                style={{ display: submitting ? 'none' : undefined }}
                className={styles.close}
                onClick={setLabelMode}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default FragmentColumnFooter;
