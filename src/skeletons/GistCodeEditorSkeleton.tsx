import { Skeleton } from 'antd';
import React from 'react';

const GistCodeEditor: React.FC = React.memo(() => {
  return <Skeleton active paragraph={{ rows: 7 }} />;
});

export default GistCodeEditor;
