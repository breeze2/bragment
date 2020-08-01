import Modal from 'antd/lib/modal/Modal';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EFragmentType, EFragmentTypeColor } from '../../api/types';
import { hideCreateFragmentDialog } from '../../redux/actions';
import { IReduxState } from '../../redux/types';
import styles from '../../styles/CreateFragmentDialog.module.scss';
import { lightedColor } from '../../utils';
import GistForm from './GistForm';

function renderDialogBody(createType: EFragmentType) {
  switch (createType) {
    case EFragmentType.GIST:
      return <GistForm />;
    default:
      return <GistForm />;
  }
}

function renderDialogHeader(createType: EFragmentType) {
  const color = EFragmentTypeColor.GIST;
  const backgroundColor = lightedColor(color, 0.9);
  const borderColor = lightedColor(color, 0.4);
  return (
    <div className={styles.header}>
      <span
        style={{ backgroundColor, borderColor, color }}
        className={styles.label}>
        {createType}
      </span>
      <p className={styles.title}>new fragment title</p>
    </div>
  );
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
      title={renderDialogHeader(createType)}
      className={styles.wrapper}
      visible={createDialogVisible}
      onCancel={handleCancel}>
      {renderDialogBody(createType)}
    </Modal>
  );
}

export default memo(CreateFragmentDialog);
