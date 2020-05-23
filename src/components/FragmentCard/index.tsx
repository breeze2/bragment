import { Card } from 'antd';
import React from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { EFragmentType, IFragmentCard } from '../../api/types';
import { setCurrentFragment } from '../../redux/actions';
import styles from '../../styles/FragmentCard.module.scss';
import NoteFragment from './NoteFragment';

interface IFragmentCardProps {
  data: IFragmentCard;
  index: number;
}

function renderContent(data: IFragmentCard) {
  if (data.type === EFragmentType.NOTE) {
    return <NoteFragment content={data.title} />;
  }
  return <>{data.title}</>;
}

const FragmentCard: React.FC<IFragmentCardProps> = React.memo((props) => {
  const { data, index } = props;
  const dispatch = useDispatch();
  const handleClick = () => dispatch(setCurrentFragment(data));

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
});

export default FragmentCard;