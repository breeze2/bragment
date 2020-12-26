import { Layout, Space } from 'antd';
import { memo } from 'react';
import styles from '../styles/Header.module.scss';
import UserAvatar from './UserAvatar';

function Header() {
  return (
    <Layout.Header className={styles.wrapper}>
      <div className={styles.rightSide}>
        <Space align="center">
          <UserAvatar />
        </Space>
      </div>
    </Layout.Header>
  );
}

export default memo(Header);
