import { Typography } from 'antd';
import { memo } from 'react';

interface ILinkCardProps {
  link: string;
  image?: string;
  title?: string;
}

const { Link } = Typography;

function LinkCard(props: ILinkCardProps) {
  const { link } = props;
  return (
    <Typography>
      <Link href={link} target="_blank">
        {link}
      </Link>
    </Typography>
  );
}

export default memo(LinkCard);
