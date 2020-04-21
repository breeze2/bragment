import { Button, Modal } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentFragment } from '../redux/actions';
import { IReduxState } from '../redux/types';

import styles from '../styles/SignInDialog.module.scss';

const SignInDialog: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const visible = useSelector(
    (state: IReduxState) => state.common.signInDialogVisible
  );

  const handleClose = () => dispatch(setCurrentFragment(null));
  return (
    <Modal
      className={styles.wrapper}
      visible={visible}
      maskClosable={false}
      footer={null}
      onCancel={handleClose}>
      <Button>login</Button>
    </Modal>
  );
});

export default SignInDialog;
