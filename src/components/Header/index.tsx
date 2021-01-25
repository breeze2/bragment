import { Space } from 'antd';
import { memo } from 'react';

import UserAvatar from '../UserAvatar';
import styles from './index.module.scss';

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
