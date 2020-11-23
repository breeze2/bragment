import {
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { memo, useLayoutEffect, useRef } from 'react';
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

interface ICreateColumnFormData {
  title: string;
}

function FragmentColumnCreator(props: IFragmentColumnCreatorProps) {
  const { formatMessage: f } = useIntl();
  const asyncDispatch = useReduxAsyncDispatch();
  const selfRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<Input>(null);
  const [form] = Form.useForm<ICreateColumnFormData>();
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
    const fields = form.getFieldsValue();
    const title = fields.title.trim();
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
        form.resetFields();
        setState(defaultState);
      });
  };

  useLayoutEffect(() => {
    if (state.mode === EMode.INPUT) {
      inputRef.current?.focus();
      const handleBodyMouseDown = (event: MouseEvent) => {
        if (
          event.target instanceof Node &&
          selfRef.current?.contains(event.target)
        ) {
          return;
        }
        setState({ mode: EMode.TEXT });
      };
      document.body.addEventListener('mousedown', handleBodyMouseDown);
      return () => {
        document.body.removeEventListener('mousedown', handleBodyMouseDown);
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
      <Form form={form} name="creat_column_for_board" className={styles.input}>
        <Form.Item name="title">
          <Input ref={inputRef} placeholder={f({ id: 'inputColumnTitle' })} />
        </Form.Item>
        <div className={styles.actions}>
          <Button
            type="primary"
            htmlType="submit"
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
      </Form>
    </div>
  );
}

export default memo(FragmentColumnCreator);
