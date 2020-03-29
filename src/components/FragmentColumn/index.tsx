import React from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import Header from './Header';

import styles from '../../styles/FragmentColumn.module.scss';

interface IFragmentColumnProps {
  index: number;
  title: string;
}

const FragmentColumn: React.FC<IFragmentColumnProps> = React.memo((props) => {
  const { title } = props;
  return (
    <Draggable draggableId={props.title} index={props.index}>
      {(
        dragProvided: DraggableProvided,
        dragSnapshot: DraggableStateSnapshot
      ) => (
        <div
          className={styles.column}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}>
          <Header title={title} dragHandle={dragProvided.dragHandleProps} />
          <Droppable droppableId={props.title} type="QUOTE">
            {(
              dropProvided: DroppableProvided,
              dropSnapshot: DroppableStateSnapshot
            ) => (
              <div
                className="column-content"
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}>
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
});

export default FragmentColumn;
