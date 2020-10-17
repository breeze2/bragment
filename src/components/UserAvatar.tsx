import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import React, { memo } from 'react';

import styles from '../styles/UserAvatar.module.scss';

function UserAvatar() {
  const menu = (
    <Menu>
      <Menu.Item key="0">log out</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown className={styles.wrapper} overlay={menu} trigger={['click']}>
      <Avatar size="large" icon={<UserOutlined />} />
    </Dropdown>
  );
}

export default memo(UserAvatar);
