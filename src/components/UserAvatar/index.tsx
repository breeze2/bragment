import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { memo } from 'react';
import { createPortal } from 'react-dom';
import { useIntl } from 'react-intl';

import {
  selectUserAuthenticating,
  selectUserSignedIn,
  userActions,
  useReduxAsyncDispatch,
  useReduxDispatch,
  useReduxSelector,
  userThunks,
} from '../../redux';
import styles from './index.module.scss';

function AuthenticatingMask() {
  return createPortal(
    <div className={styles.authenticatingMask} />,
    document.body
  );
}

function UserAvatar() {
  const { formatMessage: f } = useIntl();
  const signedIn = useReduxSelector(selectUserSignedIn);
  const authenticating = useReduxSelector(selectUserAuthenticating);
  const dispatch = useReduxDispatch();
  const asyncDispatch = useReduxAsyncDispatch();
  const showSignInDialog = () => {
    dispatch(userActions.setSignInDialogVisible(true));
  };

  const handleMenuClick = (info: MenuInfo) => {
    switch (info.key) {
      case 'signOut':
        // NOTE: after dropdown hiding
        setImmediate(() => {
          asyncDispatch(userThunks.logout());
        });
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu className={styles.dropdownMenu} onClick={handleMenuClick}>
      <Menu.Item key="signOut" icon={<LogoutOutlined />}>
        {f({ id: 'signOut' })}
      </Menu.Item>
    </Menu>
  );

  return signedIn ? (
    <Dropdown className={styles.wrapper} overlay={menu} trigger={['click']}>
      <Avatar icon={<UserOutlined />} />
    </Dropdown>
  ) : (
    <div className={styles.wrapper}>
      <Button
        type="primary"
        loading={authenticating}
        onClick={showSignInDialog}>
        {f({ id: 'signIn' })}
      </Button>
      {authenticating && <AuthenticatingMask />}
    </div>
  );
}

export default memo(UserAvatar);
