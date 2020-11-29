import { Card } from 'antd';
import { memo, useCallback } from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { EFragmentType, IFragmentCard } from '../../api/types';
import { fragmentCardActions, useReduxDispatch } from '../../redux';
import styles from '../../styles/FragmentCard.module.scss';
import LinkFragmentCard from './LinkFragmentCard';
import NoteFragmentCard from './NoteFragmentCard';

interface IFragmentCardProps {
  data: IFragmentCard;
  index: number;
}

function renderContent(data: IFragmentCard) {
  switch (data.type) {
    case EFragmentType.NOTE:
      return <NoteFragmentCard content={data.title} />;
    case EFragmentType.LINK:
      return (
        <LinkFragmentCard
          link={data.link || data.title}
          title={data.title}
          image={data.image}
        />
      );
    default:
      return <>{data.title}</>;
  }
}

function FragmentCard(props: IFragmentCardProps) {
  const { data, index } = props;
  const dispatch = useReduxDispatch();
  const handleClick = useCallback(
    () => dispatch(fragmentCardActions.setCurrentId(data.id)),
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
          <Card hoverable bordered={false} onClick={handleClick}>
            <div className={styles.content}>{content}</div>
          </Card>
        </div>
      )}
    </Draggable>
  );
}

export default memo(FragmentCard);
