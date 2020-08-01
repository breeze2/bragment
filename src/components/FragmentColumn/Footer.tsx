import {
  CloseOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { EFragmentType, IFragmentColumn } from '../../api/types';
import {
  asyncCreateFragment,
  asyncDispatch,
  showCreateFragmentDialog,
} from '../../redux/actions';
import { IReduxState } from '../../redux/types';
import styles from '../../styles/FragmentColumn.module.scss';

export enum EMode {
  INPUT,
  TEXT,
}

interface IFragmentColumnFooterProps {
  data: IFragmentColumn;
  onModeChange?: (mode: EMode, clientHeight?: number) => void;
}

function FragmentColumnFooter(props: IFragmentColumnFooterProps) {
  const { data, onModeChange } = props;
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const [mode, setMode] = useState(EMode.TEXT);
  const [submitting, setSubmitting] = useState(false);
  const selfRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<TextArea>(null);
  const currentBoard = useSelector((state: IReduxState) =>
    state.board.get('current')
  );
  const setInputMode = () => setMode(EMode.INPUT);
  const setTextMode = () => setMode(EMode.TEXT);
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
        setTextMode();
      });
  };
  const handleAddonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const menu = useMemo(
    () => (
      <Menu>
        <Menu.Item
          onClick={() => {
            dispatch(showCreateFragmentDialog(data.id, EFragmentType.GIST));
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
      const handleBodyMouseUp = (event: MouseEvent) => {
        if (
          event.target instanceof Node &&
          selfRef.current?.contains(event.target)
        ) {
          return;
        }
        setTextMode();
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
          mode === EMode.INPUT ? styles.inputMode : styles.textMode
        }`}>
        <div className={styles.text} onClick={setInputMode}>
          <PlusOutlined />
          {f({ id: 'addAnotherCard' })}
          <div className={styles.addon} onClick={handleAddonClick}>
            <Dropdown trigger={['click']} overlay={menu}>
              <EllipsisOutlined />
            </Dropdown>
          </div>
        </div>
        <div className={styles.input}>
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
              onClick={setTextMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(FragmentColumnFooter);
