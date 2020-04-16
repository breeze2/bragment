import React from 'react';
import { createMonacoEditor } from '../api/editor';

import styles from '../styles/GistCodeEditor.module.scss';

const GistCodeEditor: React.FC = React.memo(() => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (containerRef.current) {
      createMonacoEditor(containerRef.current, 'javascript', '');
    }
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={containerRef} />
    </div>
  );
});

export default GistCodeEditor;
