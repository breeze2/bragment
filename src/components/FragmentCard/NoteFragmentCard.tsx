import React from 'react';
import ReactMarkdown from 'react-markdown';

import styles from '../../styles/FragmentCard.module.scss';

interface INoteFragmentCardProps {
  content: string;
}

const NoteFragmentCard: React.FC<INoteFragmentCardProps> = React.memo(
  (props) => {
    const { content } = props;
    return <ReactMarkdown className={`${styles.note}`} source={content} />;
  }
);

export default NoteFragmentCard;
