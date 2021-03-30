import { Typography } from 'antd';
import classnames from 'classnames';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import { checkIfSingleLine } from '../../utils';
import { ICardSampleViewProps } from '../types';
import styles from './index.module.scss';

const { Paragraph, Text } = Typography;

function SampleView(props: ICardSampleViewProps) {
  const { title, content } = props.data;
  const isSingleLineTitle = !content && title && checkIfSingleLine(title);
  const isSingleLineContent = !title && content && checkIfSingleLine(content);
  return (
    <Typography className={styles.sampleView}>
      {title && (
        <Paragraph
          className={classnames(isSingleLineTitle && styles.singleLineTitle)}>
          <Text strong>{title}</Text>
        </Paragraph>
      )}
      {content && (
        <ReactMarkdown
          className={classnames(
            styles.content,
            isSingleLineContent && styles.singleLineContent
          )}
          plugins={[gfm]}
          children={content}
        />
      )}
    </Typography>
  );
}

export default memo(SampleView);
