import {
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { memo, useLayoutEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useMultipleState } from '../../components/hooks';
import {
  fragmentColumnThunks,
  selectCurrentBoard,
  selectFragmentColumnLoading,
  useReduxAsyncDispatch,
  useReduxSelector,
} from '../../redux';

import styles from '../../styles/FragmentColumn.module.scss';

enum EMode {
  INPUT,
  TEXT,
}

export interface IFragmentColumnCreatorProps {}
export interface IFragmentColumnCreatorState {
  mode: EMode;
  isCreating: boolean;
}

function FragmentColumnCreator(props: IFragmentColumnCreatorProps) {
  const { formatMessage: f } = useIntl();
  const asyncDispatch = useReduxAsyncDispatch();
  const selfRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<Input>(null);
  const defaultState: IFragmentColumnCreatorState = {
    mode: EMode.TEXT,
    isCreating: false,
  };
  const [state, setState] = useMultipleState<IFragmentColumnCreatorState>(
    defaultState
  );
  const currentBoard = useReduxSelector(selectCurrentBoard);
  const loading = useReduxSelector(selectFragmentColumnLoading);
  const setInputMode = () => setState({ mode: EMode.INPUT });
  const setTextMode = () => setState({ mode: EMode.TEXT });
  const handleCreate = () => {
    const title = inputRef.current?.state.value;
    if (!currentBoard || !currentBoard.id || !title) {
      return;
    }
    setState({ isCreating: true });
    asyncDispatch(
      fragmentColumnThunks.create({ boardId: currentBoard.id, title })
    )
      .catch(() => {
        // EXCEPTION:
      })
      .finally(() => {
        inputRef.current?.setValue('');
        setState(defaultState);
      });
  };

  useLayoutEffect(() => {
    if (state.mode === EMode.INPUT) {
      inputRef.current?.focus();
      const handleBodyMouseUp = (event: MouseEvent) => {
        if (
          event.target instanceof Node &&
          selfRef.current?.contains(event.target)
        ) {
          return;
        }
        setState({ mode: EMode.TEXT });
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
        state.mode === EMode.INPUT ? styles.inputMode : styles.textMode
      }`}>
      <div
        className={styles.text}
        onClick={loading === true ? undefined : setInputMode}>
        {loading === true ? (
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
      <div className={styles.input}>
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
            onClick={setTextMode}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(FragmentColumnCreator);
