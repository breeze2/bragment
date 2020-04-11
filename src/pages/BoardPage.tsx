import { Layout } from 'antd';
import React from 'react';
import {
  DragDropContext,
  DraggableLocation,
  DragStart,
  DragUpdate,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
} from 'react-beautiful-dnd';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getBoardImageURL } from '../api/board';
import FragmentColumn from '../components/FragmentColumn';
import FragmentColumnCreator from '../components/FragmentColumn/Creator';
import Header from '../components/Header';
import { usePrevious } from '../components/hooks';
import {
  asyncDispatch,
  asyncFetchCurrentBoard,
  asyncMoveFragment,
  asyncSaveFragmentColumnsData,
  moveFragmentColumn,
} from '../redux/actions';
import { IReduxState } from '../redux/types';
import { debounce } from '../utils';

import styles from '../styles/BoardPage.module.scss';
import FragmentCardStyles from '../styles/FragmentCard.module.scss';
import FragmentColumnStyles from '../styles/FragmentColumn.module.scss';

interface IBoardPageRouteParams {
  id?: string;
}

interface IBoardPageProps extends RouteComponentProps<IBoardPageRouteParams> {}

function getColumnHeight(column: HTMLDivElement) {
  const height = Array.prototype.reduce.call(
    column.children,
    (prev, el) => prev + el.offsetHeight,
    0
  );
  return (height || column.offsetHeight || 0) as number;
}

function getColumnPlacehodlerStyle(
  from: DraggableLocation,
  to: DraggableLocation
) {
  const fromIndex = from.index;
  const toIndex = to.index;
  const fromColumn: HTMLDivElement | null = document.querySelector(
    `.${FragmentColumnStyles.layout}:nth-of-type(${fromIndex + 2})`
  );
  if (fromColumn) {
    const style = `display: block; height: ${getColumnHeight(
      fromColumn
    )}px; left: ${266 * toIndex + 16 * toIndex + 16}px; top: 16px`;
    return style;
  }
}

function getCardPlaceholderStyle(
  from: DraggableLocation,
  to: DraggableLocation
) {
  const fromColumn = document.querySelector(
    `.${FragmentColumnStyles.container}[data-rbd-droppable-id=${from.droppableId}]`
  ) as HTMLDivElement;
  const toColumn = document.querySelector(
    `.${FragmentColumnStyles.container}[data-rbd-droppable-id=${to.droppableId}]`
  ) as HTMLDivElement;
  if (fromColumn && toColumn) {
    const toCards = toColumn.querySelectorAll(`.${FragmentCardStyles.wrapper}`);
    const fromCard: HTMLDivElement | null = fromColumn.querySelector(
      `.${FragmentCardStyles.wrapper}:nth-of-type(${from.index + 2})`
    );
    if (fromCard) {
      const top = Array.prototype.slice.call(toCards, 0, to.index).reduce(
        (value, card) => {
          return value + card.offsetHeight + 8;
        },
        toCards.length === 0 ? 6 : 0
      );
      const style = `display: block; height: ${fromCard.offsetHeight}px; position: absolute; top: ${top}px; left: 8px`;
      return style;
    }
  }
}

const BoardPage: React.FC<IBoardPageProps> = React.memo((props) => {
  const boardID = props.match.params.id;
  const currentBoard = useSelector((state: IReduxState) => state.board.current);
  const fragmentColumns = useSelector(
    (state: IReduxState) => state.fragment.columns
  );
  const prevProps = usePrevious({ boardID, fragmentColumns });
  const dispatch = useDispatch();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (type === 'COLUMN' && destination) {
      document
        .querySelector(`.${styles.columnPlaceholder}`)
        ?.removeAttribute('style');
      dispatch(moveFragmentColumn(source.index, destination.index));
    }
    if (type === 'CARD' && destination) {
      document
        .querySelectorAll(`.${FragmentColumnStyles.cardPlaceholder}`)
        .forEach((el) => el.removeAttribute('style'));
      asyncDispatch(
        dispatch,
        asyncMoveFragment(
          source.droppableId,
          source.index,
          destination.droppableId,
          destination.index
        )
      ).catch((error) => {
        // TODO: show error tips
        console.error(error);
      });
    }
  };
  const handleDragStart = (initial: DragStart) => {
    const { type } = initial;
    if (type === 'CARD') {
      const style = getCardPlaceholderStyle(initial.source, initial.source);
      if (style) {
        const placeholder: HTMLDivElement | null = document.querySelector(
          `.${FragmentColumnStyles.container}[data-rbd-droppable-id=${initial.source.droppableId}] .${FragmentColumnStyles.cardPlaceholder}`
        );
        if (placeholder) {
          placeholder.setAttribute('style', style);
        }
      }
    } else if (type === 'COLUMN') {
      const style = getColumnPlacehodlerStyle(initial.source, initial.source);
      if (style) {
        document
          .querySelector(`.${styles.columnPlaceholder}`)
          ?.setAttribute('style', style);
      }
    }
  };
  const handleDragUpdate = debounce((initial: DragUpdate) => {
    if (initial.destination) {
      if (initial.type === 'COLUMN') {
        const style = getColumnPlacehodlerStyle(
          initial.source,
          initial.destination
        );
        const placeholder: HTMLDivElement | null = document.querySelector(
          `.${styles.columnPlaceholder}`
        );
        if (style) {
          placeholder?.setAttribute('style', style);
        } else {
          placeholder?.removeAttribute('style');
        }
      }
    }
    if (initial.type === 'CARD') {
      document
        .querySelectorAll(`.${FragmentColumnStyles.cardPlaceholder}`)
        .forEach((el) => el.removeAttribute('style'));
      if (initial.destination) {
        const style = getCardPlaceholderStyle(
          initial.source,
          initial.destination
        );
        if (style) {
          const placeholder: HTMLDivElement | null = document.querySelector(
            `.${FragmentColumnStyles.container}[data-rbd-droppable-id=${initial.destination.droppableId}] .${FragmentColumnStyles.cardPlaceholder}`
          );
          placeholder?.setAttribute('style', style);
        }
      }
    }
  }, 20);
  React.useEffect(() => {
    if (boardID) {
      dispatch(asyncFetchCurrentBoard(parseInt(boardID, 10)));
    }
  }, [boardID, dispatch]);
  React.useEffect(() => {
    if (
      prevProps &&
      fragmentColumns &&
      prevProps.fragmentColumns &&
      boardID &&
      boardID === prevProps.boardID &&
      fragmentColumns !== prevProps.fragmentColumns
    ) {
      dispatch(asyncSaveFragmentColumnsData());
    }
  }, [boardID, dispatch, fragmentColumns, prevProps]);

  console.info('BoardPage rendering...');
  return (
    <Layout
      className={styles.layout}
      style={{
        backgroundColor: currentBoard ? currentBoard.color : undefined,
        backgroundImage:
          currentBoard && currentBoard.image
            ? `url(${getBoardImageURL(currentBoard)})`
            : undefined,
      }}>
      <Header />
      <Layout.Content>
        <Scrollbars autoHide>
          <DragDropContext
            onDragStart={handleDragStart}
            onDragUpdate={handleDragUpdate}
            onDragEnd={handleDragEnd}>
            <Droppable droppableId="board" type="COLUMN" direction="horizontal">
              {(
                provided: DroppableProvided,
                snapshot: DroppableStateSnapshot
              ) => (
                <div
                  ref={provided.innerRef}
                  className={`${styles.container} ${
                    snapshot.isDraggingOver ? styles.draggingOver : ''
                  }`}
                  {...provided.droppableProps}>
                  <div className={styles.columnPlaceholder} />
                  {fragmentColumns.map((column, index) => (
                    <FragmentColumn
                      id={column.id}
                      key={column.title}
                      index={index}
                      fragments={column.fragments}
                      title={column.title}
                    />
                  ))}
                  {provided.placeholder}
                  <div className={styles.actions}>
                    <FragmentColumnCreator />
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Scrollbars>
      </Layout.Content>
    </Layout>
  );
});

export default BoardPage;
