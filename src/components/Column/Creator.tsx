import {
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import classnames from 'classnames';
import { memo, useLayoutEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import {
  columnThunks,
  selectColumnLoading,
  selectCurrentBoard,
  selectUserSignedIn,
  userActions,
  useReduxAsyncDispatch,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';

import styles from '../../styles/Column.module.scss';
import { useMultipleState } from '../hooks';

enum EMode {
  INPUT,
  TEXT,
}

export interface IColumnCreatorProps {}
export interface IColumnCreatorState {
  mode: EMode;
  isCreating: boolean;
}

interface ICreateColumnFormData {
  title: string;
}

function ColumnCreator(props: IColumnCreatorProps) {
  const { formatMessage: f } = useIntl();
  const asyncDispatch = useReduxAsyncDispatch();
  const dispatch = useReduxDispatch();
  const selfRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<Input>(null);
  const [form] = Form.useForm<ICreateColumnFormData>();
  const defaultState: IColumnCreatorState = {
    mode: EMode.TEXT,
    isCreating: false,
  };
  const [state, setState] = useMultipleState<IColumnCreatorState>(defaultState);
  const currentBoard = useReduxSelector(selectCurrentBoard);
  const loading = useReduxSelector(selectColumnLoading);
  const signedIn = useReduxSelector(selectUserSignedIn);
  const setInputMode = () => setState({ mode: EMode.INPUT });
  const setTextMode = () => setState({ mode: EMode.TEXT });
  const handleTextClick = () => {
    if (loading) {
      // NOTE: do nothing
    } else if (!signedIn) {
      dispatch(userActions.setSignInDialogVisible(true));
    } else {
      setInputMode();
    }
  };
  const handleCreate = () => {
    const fields = form.getFieldsValue();
    const title = fields.title.trim();
    if (!currentBoard || !currentBoard.id || !title) {
      return;
    }
    setState({ isCreating: true });
    asyncDispatch(columnThunks.create({ boardId: currentBoard.id, title }))
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
  console.info('ColumnCreator rendering...');
  return (
    <div
      ref={selfRef}
      className={classnames(
        styles.creator,
        state.mode === EMode.INPUT ? styles.inputMode : styles.textMode
      )}>
      <div className={styles.text} onClick={handleTextClick}>
        {loading ? (
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

export default memo(ColumnCreator);
