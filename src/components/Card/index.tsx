import { Card as AntdCard } from 'antd';
import { memo, useCallback } from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { ECardType, ICard } from '../../api/types';
import { cardActions, useReduxDispatch } from '../../redux';
import styles from '../../styles/Card.module.scss';
import GistCard from './GistCard';
import LinkCard from './LinkCard';
import NoteCard from './NoteCard';

interface ICardProps {
  data: ICard;
  index: number;
}

function renderContent(data: ICard) {
  switch (data.type) {
    case ECardType.NOTE:
      return <NoteCard content={data.content} title={data.title} />;
    case ECardType.GIST:
      return <GistCard title={data.title} files={data.files} />;
    case ECardType.LINK:
      return (
        <LinkCard
          link={data.link || ''}
          title={data.title}
          image={data.image}
        />
      );
    default:
      return <>{data.title}</>;
  }
}

function Card(props: ICardProps) {
  const { data, index } = props;
  const dispatch = useReduxDispatch();
  const handleClick = useCallback(
    () => dispatch(cardActions.setCurrentId(data.id)),
    [data, dispatch]
  );

  const content = renderContent(data);

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          className={styles.wrapper}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          <AntdCard hoverable bordered={false} onClick={handleClick}>
            <div className={styles.content}>{content}</div>
          </AntdCard>
        </div>
      )}
    </Draggable>
  );
}

export default memo(Card);
