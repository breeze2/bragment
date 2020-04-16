import { Card } from 'antd';
import React from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { IFragment } from '../../api/types';
import { setCurrentFragment } from '../../redux/actions';

import styles from '../../styles/FragmentCard.module.scss';

interface IFragmentCardProps {
  fragment: IFragment;
  index: number;
}

const FragmentCard: React.FC<IFragmentCardProps> = React.memo((props) => {
  const { fragment, index } = props;
  const dispatch = useDispatch();
  const handleClick = () => dispatch(setCurrentFragment(fragment));

  return (
    <Draggable draggableId={fragment.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          className={styles.wrapper}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          <Card hoverable bordered={false} onClick={handleClick}>
            <p className={styles.title}>{fragment.title}</p>
          </Card>
        </div>
      )}
    </Draggable>
  );
});

export default FragmentCard;
