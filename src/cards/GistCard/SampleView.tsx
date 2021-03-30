import { Typography } from 'antd';
import classnames from 'classnames';
import { memo } from 'react';

import { ICardSampleViewProps } from '../types';
import styles from './index.module.scss';

const { Paragraph, Text } = Typography;

function SampleView(props: ICardSampleViewProps) {
  const { title, files } = props.data;
  return (
    <Typography className={styles.sampleView}>
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

export default memo(SampleView);
