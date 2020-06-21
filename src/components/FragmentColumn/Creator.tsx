import {
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { memo, useLayoutEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useMultipleState } from '../../components/hooks';
import { asyncCreateFragmentColumn, asyncDispatch } from '../../redux/actions';
import { IReduxState } from '../../redux/types';

import styles from '../../styles/FragmentColumn.module.scss';

enum EMode {
  FIELD,
  LABEL,
}

export interface IFragmentColumnCreatorProps {}
export interface IFragmentColumnCreatorState {
  mode: EMode;
  isCreating: boolean;
}

function FragmentColumnCreator(props: IFragmentColumnCreatorProps) {
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const selfRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<Input>(null);
  const defaultState: IFragmentColumnCreatorState = {
    mode: EMode.LABEL,
    isCreating: false,
  };
  const [state, setState] = useMultipleState<IFragmentColumnCreatorState>(
    defaultState
  );
  const currentBoard = useSelector((reduxState: IReduxState) =>
    reduxState.board.get('current')
  );
  const isLoading = useSelector((reduxState: IReduxState) =>
    reduxState.fragment.get('isLoading')
  );
  const setFieldMode = () => setState({ mode: EMode.FIELD });
  const setLabelMode = () => setState({ mode: EMode.LABEL });
  const handleCreate = () => {
    const title = inputRef.current?.state.value;
    if (!currentBoard || !currentBoard.id || !title) {
      return;
    }
    setState({ isCreating: true });
    asyncDispatch(dispatch, asyncCreateFragmentColumn(currentBoard.id, title))
      .catch(() => {
        // EXCEPTION:
      })
      .finally(() => {
        inputRef.current?.setValue('');
        setState(defaultState);
      });
  };

  useLayoutEffect(() => {
    if (state.mode === EMode.FIELD) {
      inputRef.current?.focus();
      const handleBodyMouseUp = (event: MouseEvent) => {
        if (
          event.target instanceof Node &&
          selfRef.current?.contains(event.target)
        ) {
          return;
        }
        setState({ mode: EMode.LABEL });
      };
      document.body.addEventListener('mouseup', handleBodyMouseUp);
      return () => {
        document.body.removeEventListener('mouseup', handleBodyMouseUp);
      };
    }
  }, [state.mode, setState]);
  console.info('FragmentColumnCreator rendering...');
  return (
    <div
      ref={selfRef}
      className={`${styles.creator} ${
        state.mode === EMode.FIELD ? styles.fieldMode : styles.labelMode
      }`}>
      <div
        className={styles.label}
        onClick={isLoading === true ? undefined : setFieldMode}>
        {isLoading === true ? (
          <>
            <LoadingOutlined />
            {f({ id: 'loading' })}
          </>
        ) : (
          <>
            <PlusOutlined />
            {f({ id: 'addAnotherColumn' })}
          </>
        )}
      </div>
      <div className={styles.field}>
        <Input
          ref={inputRef}
          placeholder={f({ id: 'inputColumnTitle' })}
          onPressEnter={handleCreate}
        />
        <div className={styles.actions}>
          <Button
            type="primary"
            loading={state.isCreating}
            onClick={handleCreate}>
            {f({ id: 'addColumn' })}
          </Button>
          <CloseOutlined
            style={{ display: state.isCreating ? 'none' : undefined }}
            className={styles.close}
            onClick={setLabelMode}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(FragmentColumnCreator);
