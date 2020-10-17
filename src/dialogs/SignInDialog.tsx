import { Button, Modal } from 'antd';
import React, { memo } from 'react';
import { selectSignInDialogVisible, useReduxSelector } from '../redux';

import styles from '../styles/SignInDialog.module.scss';

function SignInDialog() {
  const visible = useReduxSelector(selectSignInDialogVisible);

  return (
    <Modal
      className={styles.wrapper}
      visible={visible}
      maskClosable={false}
      footer={null}>
      <Button>login</Button>
    </Modal>
  );
}

export default memo(SignInDialog);
