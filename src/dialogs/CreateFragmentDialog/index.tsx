import Modal from 'antd/lib/modal/Modal';
import React, { memo } from 'react';
import { EFragmentType } from '../../api/types';
import {
  fragmentCardActions,
  selectCreateFragmentCardAsType,
  selectCreateFragmentCardDialogVisible,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';
import styles from '../../styles/CreateFragmentDialog.module.scss';
import GistForm from './GistForm';

function renderCreateForm(createAsType: EFragmentType) {
  switch (createAsType) {
    case EFragmentType.GIST:
      return <GistForm />;
    default:
      return <GistForm />;
  }
}

function CreateFragmentDialog() {
  const dispatch = useReduxDispatch();
  const createAsType = useReduxSelector(selectCreateFragmentCardAsType);
  const visible = useReduxSelector(selectCreateFragmentCardDialogVisible);
  const handleCancel = () => {
    dispatch(fragmentCardActions.hideCreateDialog());
  };

  return (
    <Modal
      className={styles.wrapper}
      title={null}
      footer={null}
      width={720}
      visible={visible}
      onCancel={handleCancel}>
      <div className={styles.body}>{renderCreateForm(createAsType)}</div>
    </Modal>
  );
}

export default memo(CreateFragmentDialog);
