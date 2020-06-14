import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { memo, useLayoutEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { IFragmentColumn } from '../../api/types';
import { asyncCreateFragment, asyncDispatch } from '../../redux/actions';
import { IReduxState } from '../../redux/types';

import styles from '../../styles/FragmentColumn.module.scss';

export enum EMode {
  FIELD,
  LABEL,
}

interface IFragmentColumnFooterProps {
  data: IFragmentColumn;
  onModeChange?: (mode: EMode, clientHeight?: number) => void;
}

function FragmentColumnFooter(props: IFragmentColumnFooterProps) {
  const { data, onModeChange } = props;
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const [mode, setMode] = useState(EMode.LABEL);
  const [submitting, setSubmitting] = useState(false);
  const selfRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<TextArea>(null);
  const currentBoard = useSelector((state: IReduxState) =>
    state.board.get('current')
  );
  const setFieldMode = () => setMode(EMode.FIELD);
  const setLabelMode = () => setMode(EMode.LABEL);
  const handlePressEnter = () => {
    setImmediate(() => {
      if (onModeChange) {
        onModeChange(mode, selfRef.current?.clientHeight);
      }
    });
  };
  const handleSubmit = () => {
    const title = inputRef.current?.state.value;
    if (!data.id || !currentBoard || !currentBoard.id || !title) {
      return;
    }
    setSubmitting(true);
    asyncDispatch(
      dispatch,
      asyncCreateFragment(currentBoard.id, data.id, title)
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
  useLayoutEffect(() => {
    if (onModeChange) {
      onModeChange(mode, selfRef.current?.clientHeight);
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
          <PlusOutlined />
          {f({ id: 'addAnotherCard' })}
        </div>
        <div className={styles.field}>
          <TextArea
            ref={inputRef}
            placeholder={f({ id: 'inputCardTitle' })}
            autoSize={{ minRows: 1, maxRows: 6 }}
            onPressEnter={handlePressEnter}
          />
          <div className={styles.actions}>
            <Button type="primary" loading={submitting} onClick={handleSubmit}>
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

export default memo(FragmentColumnFooter);
