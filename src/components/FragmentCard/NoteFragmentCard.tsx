import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';

import styles from '../../styles/FragmentCard.module.scss';

interface INoteFragmentCardProps {
  content: string;
}

function NoteFragmentCard(props: INoteFragmentCardProps) {
  const { content } = props;
  return <ReactMarkdown className={`${styles.note}`} source={content} />;
}

export default memo(NoteFragmentCard);
