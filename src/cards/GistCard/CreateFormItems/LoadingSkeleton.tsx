import { Skeleton } from 'antd';
import { memo } from 'react';
import styles from '../index.module.scss';

function LoadingSkeleton() {
  return (
    <div className={styles.loadingSkeleton}>
      <Skeleton active paragraph={{ rows: 11 }} />
      <Skeleton.Button active style={{ marginTop: 16 }} />
    </div>
  );
}

export default memo(LoadingSkeleton);
