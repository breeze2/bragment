import { Typography } from 'antd';
import { memo } from 'react';
import { ICardSampleViewProps } from '../types';

const { Link } = Typography;

function SampleView(props: ICardSampleViewProps) {
  const { link } = props.data;
  return (
    <Typography>
      <Link href={link} target="_blank">
        {link}
      </Link>
    </Typography>
  );
}

export default memo(SampleView);
