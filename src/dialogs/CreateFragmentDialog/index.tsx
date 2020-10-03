import Modal from 'antd/lib/modal/Modal';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EFragmentType } from '../../api/types';
import { hideCreateFragmentDialog } from '../../redux/actions';
import { IReduxState } from '../../redux/types';
import styles from '../../styles/CreateFragmentDialog.module.scss';
import GistForm from './GistForm';

function renderCreateForm(createType: EFragmentType) {
  switch (createType) {
    case EFragmentType.GIST:
      return <GistForm />;
    default:
      return <GistForm />;
  }
}

function CreateFragmentDialog() {
  const dispatch = useDispatch();
  const createType = useSelector(
    (reduxState: IReduxState) => reduxState.fragment.createType
  );
  const createDialogVisible = useSelector(
    (reduxState: IReduxState) => reduxState.fragment.createDialogVisible
  );
  const handleCancel = () => {
    dispatch(hideCreateFragmentDialog());
  };

  return (
    <Modal
      className={styles.wrapper}
      title={null}
      footer={null}
      width={720}
      visible={createDialogVisible}
      onCancel={handleCancel}>
      <div className={styles.body}>{renderCreateForm(createType)}</div>
    </Modal>
  );
}

export default memo(CreateFragmentDialog);
