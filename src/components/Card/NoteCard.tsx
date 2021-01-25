import { Typography } from 'antd';
import classnames from 'classnames';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import { checkIfSingleLine } from '../../utils';
import styles from './index.module.scss';

interface INoteCardProps {
  title?: string;
  content?: string;
}

const { Paragraph, Text } = Typography;

function NoteCard(props: INoteCardProps) {
  const { title, content } = props;
  const isSingleLineTitle = !content && title && checkIfSingleLine(title);
  const isSingleLineContent = !title && content && checkIfSingleLine(content);
  return (
    <Typography>
      {title && (
        <Paragraph
          className={classnames(isSingleLineTitle && styles.singleLineTitle)}>
          <Text strong>{title}</Text>
        </Paragraph>
      )}
      {content && (
        <ReactMarkdown
          className={classnames(
            styles.note,
            isSingleLineContent && styles.singleLineContent
          )}
          plugins={[gfm]}
          children={content}
        />
      )}
    </Typography>
  );
}

export default memo(NoteCard);
