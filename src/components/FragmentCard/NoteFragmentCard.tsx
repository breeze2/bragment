import { Typography } from 'antd';
import classnames from 'classnames';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import styles from '../../styles/FragmentCard.module.scss';
import { checkIfSingleLine } from '../../utils';

interface INoteFragmentCardProps {
  content: string;
}

function NoteFragmentCard(props: INoteFragmentCardProps) {
  const { content } = props;
  const isSingleLine = checkIfSingleLine(content);
  return (
    <Typography>
      <ReactMarkdown
        className={classnames(styles.note, isSingleLine && styles.singleLine)}
        plugins={[gfm]}
        children={content}
      />
    </Typography>
  );
}

export default memo(NoteFragmentCard);
