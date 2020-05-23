import { Layout } from 'antd';
import React from 'react';
import styles from '../styles/Header.module.scss';
import UserAvatar from './UserAvatar';

const Header: React.FC = React.memo(() => {
  return (
    <Layout.Header className={styles.wrapper}>
      <UserAvatar />
    </Layout.Header>
  );
});

export default Header;
