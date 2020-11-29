import { Typography } from 'antd';
import { memo } from 'react';
import styles from '../../styles/FragmentCard.module.scss';

interface ILinkFragmentCardProps {
  image?: string;
  link: string;
  title: string;
}

function LinkFragmentCard(props: ILinkFragmentCardProps) {
  const { link } = props;
  return (
    <Typography>
      <div className={styles.singleLine}>
        <p>
          <a href={link} target="_blank" rel="noreferrer">
            {link}
          </a>
        </p>
      </div>
    </Typography>
  );
}

export default memo(LinkFragmentCard);
