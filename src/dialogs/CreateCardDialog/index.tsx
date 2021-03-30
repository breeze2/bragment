import Modal from 'antd/lib/modal/Modal';
import { memo, useCallback } from 'react';
import {
  cardActions,
  selectCreateCardDialogVisible,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';
import CreateCardForm from './CreateCardForm';
import styles from './index.module.scss';

function CreateCardDialog() {
  const dispatch = useReduxDispatch();
  const visible = useReduxSelector(selectCreateCardDialogVisible);
  const close = useCallback(() => {
    dispatch(cardActions.hideCreateDialog());
  }, [dispatch]);

  return (
    <Modal
      className={styles.wrapper}
      title={null}
      footer={null}
      width={540}
      visible={visible}
      centered={true}
      onCancel={close}>
      <div className={styles.body}>
        <CreateCardForm onFinish={close} />
      </div>
    </Modal>
  );
}

export default memo(CreateCardDialog);
