import { Typography } from 'antd';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import styles from '../../styles/FragmentCard.module.scss';

interface INoteFragmentCardProps {
  content: string;
}

function NoteFragmentCard(props: INoteFragmentCardProps) {
  const { content } = props;
  return (
    <Typography>
      <ReactMarkdown
        className={styles.note}
        plugins={[gfm]}
        children={content}
      />
    </Typography>
  );
}

export default memo(NoteFragmentCard);
