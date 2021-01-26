import { Typography } from 'antd';
import classnames from 'classnames';
import { memo } from 'react';

import { ICardFile } from '../../api/types';
import styles from './index.module.scss';

interface IGistCardProps {
  title?: string;
  files?: ICardFile[];
}

const { Paragraph, Text } = Typography;

function GistCard(props: IGistCardProps) {
  const { title, files } = props;
  return (
    <Typography>
      {title && (
        <Paragraph
          className={classnames(!files?.length && styles.singleLineTitle)}>
          <Text strong>{title}</Text>
        </Paragraph>
      )}
      {!!files?.length && (
        <Paragraph>
          <pre>{files[0].content}</pre>
        </Paragraph>
      )}
    </Typography>
  );
}

export default memo(GistCard);
