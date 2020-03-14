import React from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import EditableText from './EditableText';

import styles from '../styles/FragmentColumn.module.scss';

interface IFragmentColumnProps {
  index: number;
  boardID: string;
  title: string;
}

const FragmentColumn: React.FC<IFragmentColumnProps> = React.memo(props => {
  const { title } = props;
  return (
    <Draggable draggableId={props.title} index={props.index}>
      {(
        dragProvided: DraggableProvided,
        dragSnapshot: DraggableStateSnapshot
      ) => (
        <div ref={dragProvided.innerRef} {...dragProvided.draggableProps}>
          <div className={styles.header} {...dragProvided.dragHandleProps}>
            <EditableText defaultValue={title} />
          </div>
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
