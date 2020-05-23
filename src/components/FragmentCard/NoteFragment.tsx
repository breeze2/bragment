import React from 'react';
import ReactMarkdown from 'react-markdown';

import MarkdownStyles from '../../styles/Markdown.module.scss';

interface INoteFragmentProps {
  content: string;
}

const NoteFragment: React.FC<INoteFragmentProps> = React.memo((props) => {
  const { content } = props;
  return <ReactMarkdown className={MarkdownStyles.body} source={content} />;
});

export default NoteFragment;
