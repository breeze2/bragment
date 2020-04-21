import { Layout } from 'antd';
import React from 'react';
import UserAvatar from './UserAvatar';

import styles from '../styles/Header.module.scss';

const Header: React.FC = React.memo(() => {
  return (
    <Layout.Header className={styles.wrapper}>
      <UserAvatar />
    </Layout.Header>
  );
});

export default Header;
