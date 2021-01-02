import { Space } from 'antd';
import { memo } from 'react';
import styles from '../styles/Header.module.scss';
import UserAvatar from './UserAvatar';

function Header() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.rightSide}>
        <Space align="center" className={styles.userActions}>
          <UserAvatar />
        </Space>
      </div>
    </div>
  );
}

export default memo(Header);
