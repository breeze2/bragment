import { Skeleton } from 'antd';
import React, { memo } from 'react';
import styles from '../styles/Skeletons.module.scss';

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
