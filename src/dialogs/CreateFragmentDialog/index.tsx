import Modal from 'antd/lib/modal/Modal';
import React, { memo } from 'react';
import { EFragmentType } from '../../api/types';
import {
  fragmentCardActions,
  selectCreateFragmentCardAsType,
  selectCreateFragmentCardDialogVisible,
  selectCurrentFragmentColumnList,
  selectFragmentCardCreateForColumn,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';
import styles from '../../styles/CreateFragmentDialog.module.scss';
import GistForm from './GistForm';

function CreateFragmentDialog() {
  const dispatch = useReduxDispatch();
  const columnList = useReduxSelector(selectCurrentFragmentColumnList);
  const createForColumn = useReduxSelector(selectFragmentCardCreateForColumn);
  const createAsType = useReduxSelector(selectCreateFragmentCardAsType);
  const visible = useReduxSelector(selectCreateFragmentCardDialogVisible);
  const close = () => {
    dispatch(fragmentCardActions.hideCreateDialog());
  };
  const handleColumnChange = (columnId: string) => {
    dispatch(fragmentCardActions.setCreateForColumnId(columnId));
  };

  const renderCreateForm = (type: EFragmentType) => {
    switch (type) {
      case EFragmentType.GIST:
        return (
          <GistForm
            columnList={columnList}
            selectedColumn={createForColumn}
            onColumnChange={handleColumnChange}
            onFinish={close}
          />
        );
      default:
        return (
          <GistForm
            columnList={columnList}
            selectedColumn={createForColumn}
            onColumnChange={handleColumnChange}
            onFinish={close}
          />
        );
    }
  };

  return (
    <Modal
      className={styles.wrapper}
      title={null}
      footer={null}
      width={720}
      visible={visible}
      centered={true}
      onCancel={close}>
      <div className={styles.body}>{renderCreateForm(createAsType)}</div>
    </Modal>
  );
}

export default memo(CreateFragmentDialog);
