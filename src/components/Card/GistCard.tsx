import { Typography } from 'antd';
import { memo } from 'react';
import { ICardFile } from '../../api/types';

interface IGistCardProps {
  title: string;
  files?: ICardFile[];
}

const { Paragraph, Text } = Typography;

function GistCard(props: IGistCardProps) {
  const { title, files } = props;
  return (
    <Typography>
      <Paragraph>
        <Text strong>{title}</Text>
      </Paragraph>
      {!!files?.length && (
        <Paragraph>
          <pre>{files[0].content}</pre>
        </Paragraph>
      )}
    </Typography>
  );
}

export default memo(GistCard);
