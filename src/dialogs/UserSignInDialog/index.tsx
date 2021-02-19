import { Modal, Tabs } from 'antd';
import { memo } from 'react';

import { useFormatMessage } from '../../components/hooks';
import {
  selectUserSignInDialogVisible,
  userActions,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';
import styles from './index.module.scss';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

function UserSignInDialog() {
  const f = useFormatMessage();
  const dispatch = useReduxDispatch();
  const visible = useReduxSelector(selectUserSignInDialogVisible);
  const hideSignInDialog = () => {
    dispatch(userActions.setSignInDialogVisible(false));
  };

  return (
    <Modal
      className={styles.wrapper}
      visible={visible}
      maskClosable={false}
      centered={true}
      width={360}
      footer={null}
      onCancel={hideSignInDialog}>
      <Tabs defaultActiveKey="signIn">
        <Tabs.TabPane tab={f('signIn')} key="signIn">
          <SignInForm onFinish={hideSignInDialog} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={f('signUp')} key="signUp">
          <SignUpForm onFinish={hideSignInDialog} />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}

export default memo(UserSignInDialog);
