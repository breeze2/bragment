import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import {
  selectCurrentUserId,
  userActions,
  useReduxAsyncDispatch,
  useReduxDispatch,
  useReduxSelector,
  userThunks,
} from '../redux';
import { AUTHENTICATING } from '../redux/types';

import styles from '../styles/UserAvatar.module.scss';

function UserAvatar() {
  const { formatMessage: f } = useIntl();
  const userId = useReduxSelector(selectCurrentUserId);
  const dispatch = useReduxDispatch();
  const asyncDispatch = useReduxAsyncDispatch();
  const showSignInDialog = () => {
    dispatch(userActions.setSignInDialogVisible(true));
  };
  const authenticating = userId === AUTHENTICATING;

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

  return userId && !authenticating ? (
    <Dropdown className={styles.wrapper} overlay={menu} trigger={['click']}>
      <Avatar size="large" icon={<UserOutlined />} />
    </Dropdown>
  ) : (
    <div className={styles.wrapper}>
      <Button
        type="primary"
        loading={authenticating}
        onClick={showSignInDialog}>
        {f({ id: 'signIn' })}
      </Button>
      {authenticating && <div className={styles.authenticatingMask} />}
    </div>
  );
}

export default memo(UserAvatar);
