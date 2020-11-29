import { Modal, Tabs } from 'antd';
import { memo } from 'react';
import { useIntl } from 'react-intl';
import {
  selectUserSignInDialogVisible,
  userActions,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';
import styles from '../../styles/UserSignInDialog.module.scss';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

function UserSignInDialog() {
  const { formatMessage: f } = useIntl();
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
        <Tabs.TabPane tab={f({ id: 'signIn' })} key="signIn">
          <SignInForm onFinish={hideSignInDialog} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={f({ id: 'signUp' })} key="signUp">
          <SignUpForm onFinish={hideSignInDialog} />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}

export default memo(UserSignInDialog);