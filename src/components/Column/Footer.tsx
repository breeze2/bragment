import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import TextArea, { TextAreaRef } from 'antd/lib/input/TextArea';
import classnames from 'classnames';
import { memo, useLayoutEffect, useRef, useState } from 'react';

import { IColumn } from '../../api/database/types';
import { cardThunks, useReduxAsyncDispatch } from '../../redux';
import { useFormatMessage } from '../hooks';
import FooterDropdown from './FooterDropdown';
import styles from './index.module.scss';

export enum EMode {
  INPUT,
  TEXT,
}

interface IColumnFooterProps {
  data: IColumn;
  onModeChange?: (mode: EMode, clientHeight?: number) => void;
}

interface ICreateCardFormData {
  content: string;
}

const defaultInputMaxRows = 6;

function ColumnFooter(props: IColumnFooterProps) {
  const { data, onModeChange } = props;
  const f = useFormatMessage();
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
    const content = fields.content.trim();
    if (!data.id || !data.boardId || !content) {
      return;
    }
    setSubmitting(true);
    asyncDispatch(
      cardThunks.simplyCreate({
        boardId: data.boardId,
        columnId: data.id,
        content,
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
          mode === EMode.TEXT ? styles.textMode : styles.inputMode
        )}>
        {mode === EMode.TEXT ? (
          <div className={styles.text} onClick={setInputMode}>
            <PlusOutlined />
            {f('addAnotherCard')}
          </div>
        ) : (
          <Form
            form={form}
            name={`create_card_for_column${data.id}`}
            className={styles.input}>
            <Form.Item name="content">
              <TextArea
                ref={inputRef}
                placeholder={f('inputCardTitle')}
                autoSize={{ minRows: 1, maxRows: inputMaxRows }}
                onChange={handleTitleChange}
              />
            </Form.Item>
            <div className={styles.actions}>
              <Button
                type="primary"
                loading={submitting}
                onClick={handleSubmit}>
                {f('addCard')}
              </Button>
              <CloseOutlined
                style={{ display: submitting ? 'none' : undefined }}
                className={styles.close}
                onClick={setTextMode}
              />
            </div>
          </Form>
        )}
        <div className={styles.addon}>
          <FooterDropdown columnId={data.id} />
        </div>
      </div>
    </div>
  );
}

export default memo(ColumnFooter);
