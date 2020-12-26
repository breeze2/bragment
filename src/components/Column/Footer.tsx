import {
  CloseOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Form, Menu } from 'antd';
import TextArea, { TextAreaRef } from 'antd/lib/input/TextArea';
import classnames from 'classnames';
import {
  memo,
  MouseEvent as ReactMouseEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import { ECardType, IColumn } from '../../api/types';
import {
  cardActions,
  cardThunks,
  useReduxAsyncDispatch,
  useReduxDispatch,
} from '../../redux';
import styles from '../../styles/Column.module.scss';

export enum EMode {
  INPUT,
  TEXT,
}

interface IColumnFooterProps {
  data: IColumn;
  onModeChange?: (mode: EMode, clientHeight?: number) => void;
}

interface ICreateCardFormData {
  title: string;
}

const defaultInputMaxRows = 6;

function ColumnFooter(props: IColumnFooterProps) {
  const { data, onModeChange } = props;
  const { formatMessage: f } = useIntl();
  const dispatch = useReduxDispatch();
  const asyncDispatch = useReduxAsyncDispatch();
  const [mode, setMode] = useState(EMode.TEXT);
  const [submitting, setSubmitting] = useState(false);
  const [inputMaxRows, setInputMaxRows] = useState(defaultInputMaxRows);
  const selfRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<TextAreaRef>(null);
  const [form] = Form.useForm<ICreateCardFormData>();
  const setInputMode = () => setMode(EMode.INPUT);
  const setTextMode = () => setMode(EMode.TEXT);
  const handleTitleChange = () => {
    // NOTE: set input max rows
    const { offsetHeight } = document.body;
    const rows = Math.floor((offsetHeight - 138 - 68) / 22);
    const maxRows = Math.max(Math.min(rows, defaultInputMaxRows), 1);
    if (maxRows === inputMaxRows) {
      return;
    }
    setInputMaxRows(maxRows);
    setImmediate(() => {
      if (onModeChange) {
        onModeChange(mode, selfRef.current?.clientHeight);
      }
    });
  };
  const handleSubmit = () => {
    const fields = form.getFieldsValue();
    const title = fields.title.trim();
    if (!data.id || !data.boardId || !title) {
      return;
    }
    setSubmitting(true);
    asyncDispatch(
      cardThunks.create({
        boardId: data.boardId,
        columnId: data.id,
        title,
      })
    )
      .catch(() => {
        // TODO: handle EXCEPTION
      })
      .finally(() => {
        form.resetFields();
        setSubmitting(false);
        setTextMode();
      });
  };
  const handleAddonClick = (event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const menu = useMemo(
    () => (
      <Menu>
        <Menu.Item
          onClick={() => {
            dispatch(cardActions.showCreateDialog(data.id, ECardType.GIST));
          }}>
          {f({ id: 'addGistCard' })}
        </Menu.Item>
      </Menu>
    ),
    [data.id, dispatch, f]
  );

  useLayoutEffect(() => {
    if (onModeChange) {
      onModeChange(mode, selfRef.current?.clientHeight);
    }
    if (mode === EMode.INPUT) {
      inputRef.current?.focus();
      const handleBodyMouseDown = (event: MouseEvent) => {
        if (
          event.target instanceof Node &&
          selfRef.current?.contains(event.target)
        ) {
          return;
        }
        setTextMode();
      };
      document.body.addEventListener('mousedown', handleBodyMouseDown);
      return () => {
        document.body.removeEventListener('mousedown', handleBodyMouseDown);
      };
    }
  }, [mode, onModeChange]);

  console.info('ColumnFooter rendering...');
  return (
    <div ref={selfRef} className={styles.footer}>
      <div
        className={classnames(
          styles.creator,
          mode === EMode.INPUT ? styles.inputMode : styles.textMode
        )}>
        <div className={styles.text} onClick={setInputMode}>
          <PlusOutlined />
          {f({ id: 'addAnotherCard' })}
          <div className={styles.addon} onClick={handleAddonClick}>
            <Dropdown trigger={['click']} overlay={menu}>
              <EllipsisOutlined />
            </Dropdown>
          </div>
        </div>
        <Form
          form={form}
          name={`create_card_for_column${data.id}`}
          className={styles.input}>
          <Form.Item name="title">
            <TextArea
              ref={inputRef}
              placeholder={f({ id: 'inputCardTitle' })}
              autoSize={{ minRows: 1, maxRows: inputMaxRows }}
              onChange={handleTitleChange}
            />
          </Form.Item>
          <div className={styles.actions}>
            <Button type="primary" loading={submitting} onClick={handleSubmit}>
              {f({ id: 'addCard' })}
            </Button>
            <CloseOutlined
              style={{ display: submitting ? 'none' : undefined }}
              className={styles.close}
              onClick={setTextMode}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}

export default memo(ColumnFooter);
