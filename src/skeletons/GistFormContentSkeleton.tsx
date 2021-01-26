import { Skeleton } from 'antd';
import { memo } from 'react';
import styles from './Skeletons.module.scss';

function GistFormContentSkeleton() {
  return (
    <Skeleton
      className={styles.gistFormContent}
      active
      paragraph={{ rows: 11 }}
    />
  );
}

export default memo(GistFormContentSkeleton);
