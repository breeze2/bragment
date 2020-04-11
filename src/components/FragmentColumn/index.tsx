import React from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { Scrollbars } from 'react-custom-scrollbars';
import { IFragment } from '../../api/types';
import FragmentCard from '../FragmentCard';
import Footer, { EMode } from './Footer';
import Header from './Header';

import styles from '../../styles/FragmentColumn.module.scss';

interface IFragmentColumnProps {
  id: string;
  index: number;
  title: string;
  fragments: IFragment[];
}

const FragmentColumn: React.FC<IFragmentColumnProps> = React.memo((props) => {
  const { id, fragments, title } = props;
  const [scrollbarMaxHeight, setScrollbarMaxHeight] = React.useState(
    'calc(100vh - 192px)'
  );
  const handleFooterModeChange = (mode: EMode) => {
    if (mode === EMode.LABEL) {
      setScrollbarMaxHeight('calc(100vh - 192px)');
    } else {
      setScrollbarMaxHeight('calc(100vh - 232px)');
    }
  };
  return (
    <Draggable draggableId={props.title} index={props.index}>
      {(
        dragProvided: DraggableProvided,
        dragSnapshot: DraggableStateSnapshot
      ) => (
        <div
          className={`${styles.layout} ${
            fragments.length === 0 ? styles.empty : ''
          }`}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}>
          <Header
            id={id}
            title={title}
            dragHandle={dragProvided.dragHandleProps}
          />
          <Scrollbars
            className={styles.content}
            autoHeightMax={scrollbarMaxHeight}
            autoHeight
            autoHide>
            <Droppable droppableId={props.title} type="CARD">
              {(
                dropProvided: DroppableProvided,
                dropSnapshot: DroppableStateSnapshot
              ) => (
                <div
                  ref={dropProvided.innerRef}
                  className={`${styles.container} ${
                    dropSnapshot.isDraggingOver ? styles.draggingOver : ''
                  }`}
                  {...dropProvided.droppableProps}>
                  <div className={styles.cardPlaceholder} />
                  {fragments.map((fragment, index) => (
                    <FragmentCard
                      id={fragment.id}
                      index={index}
                      key={fragment.id}
                      title={fragment.title}
                    />
                  ))}
                  {dropProvided.placeholder}
                </div>
              )}
            </Droppable>
          </Scrollbars>
          <Footer id={id} onModeChange={handleFooterModeChange} />
        </div>
      )}
    </Draggable>
  );
});

export default FragmentColumn;
