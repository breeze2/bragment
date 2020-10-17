import { Layout } from 'antd';
import React, { memo } from 'react';
import styles from '../styles/Header.module.scss';
import UserAvatar from './UserAvatar';

function Header() {
  return (
    <Layout.Header className={styles.wrapper}>
      <UserAvatar />
    </Layout.Header>
  );
}

export default memo(Header);
