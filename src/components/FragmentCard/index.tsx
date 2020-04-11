import { Card } from 'antd';
import React from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

import styles from '../../styles/FragmentCard.module.scss';

interface IFragmentCardProps {
  id: string;
  index: number;
  title: string;
}

const FragmentCard: React.FC<IFragmentCardProps> = React.memo((props) => {
  const { id, index, title } = props;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          className={styles.wrapper}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          <Card hoverable bordered={false}>
            <p className={styles.title}>{title}</p>
          </Card>
        </div>
      )}
    </Draggable>
  );
});

export default FragmentCard;
