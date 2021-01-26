import classnames from 'classnames';
import { memo, useCallback, useLayoutEffect } from 'react';
import {
  DragDropContext,
  DragStart,
  DragUpdate,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
} from 'react-beautiful-dnd';
import { Scrollbars } from 'react-custom-scrollbars';
import { RouteComponentProps } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { IColumn } from '../../api/types';
import Column from '../../components/Column';
import ColumnCreator from '../../components/Column/Creator';
import CreateCardDialog from '../../dialogs/CreateCardDialog';
import {
  boardActions,
  boardThunks,
  cardThunks,
  columnActions,
  columnThunks,
  selectBoardEntities,
  selectColumnEntities,
  selectUserSignedIn,
  useReduxAsyncDispatch,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';
import BoardRouteBackground from './Background';
import {
  getAllCardPlaceholders,
  getCardPlaceholder,
  getCardWrapperId,
  getColumnPlaceholder,
  getColumnWrapperId,
  makeCardPlaceholderStyle,
  makeColumnPlaceholderStyle,
} from './helpers';
import styles from './index.module.scss';

interface IBoardRouteParams {
  id?: string;
}

interface IBoardRouteProps extends RouteComponentProps<IBoardRouteParams> {}

function BoardRoute(props: IBoardRouteProps) {
  const boardId = props.match.params.id;
  const dispatch = useReduxDispatch();
  const asyncDispatch = useReduxAsyncDispatch();
  const boardEntities = useReduxSelector(selectBoardEntities);
  const isSignedIn = useReduxSelector(selectUserSignedIn);
  const columnEntities = useReduxSelector(selectColumnEntities);
  const currentBoard = boardId ? boardEntities[boardId] : undefined;

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, type } = result;
      if (type === 'COLUMN' && destination) {
        const fromId = getColumnWrapperId(source.index);
        const toId = getColumnWrapperId(destination.index);
        getColumnPlaceholder()?.removeAttribute('style');
        if (currentBoard && fromId && toId && fromId !== toId) {
          dispatch(
            boardThunks.moveColumn({
              fromBoardId: currentBoard.id,
              fromId,
              toBoardId: currentBoard.id,
              toId,
            })
          );
        }
      }
      if (type === 'CARD' && destination) {
        getAllCardPlaceholders().forEach((el) => el.removeAttribute('style'));
        const fromId = getCardWrapperId(source.droppableId, source.index);
        const toId = getCardWrapperId(
          destination.droppableId,
          destination.index
        );
        if (fromId) {
          dispatch(
            columnThunks.moveCard({
              fromColumnId: source.droppableId,
              fromId,
              toColumnId: destination.droppableId,
              toId,
            })
          );
        }
      }
    },
    [currentBoard, dispatch]
  );
  const handleDragStart = useCallback((initial: DragStart) => {
    const { source, type } = initial;
    if (type === 'CARD') {
      const style = makeCardPlaceholderStyle(source, source);
      if (style) {
        getCardPlaceholder(source.droppableId)?.setAttribute('style', style);
      }
    } else if (type === 'COLUMN') {
      const style = makeColumnPlaceholderStyle(source, source);
      if (style) {
        getColumnPlaceholder()?.setAttribute('style', style);
      }
    }
  }, []);
  const handleDragUpdate = useCallback((initial: DragUpdate) => {
    const { destination, source, type } = initial;
    if (destination) {
      if (type === 'COLUMN') {
        const style = makeColumnPlaceholderStyle(source, destination);
        const placeholder = getColumnPlaceholder();
        if (style) {
          placeholder?.setAttribute('style', style);
        } else {
          placeholder?.removeAttribute('style');
        }
      }
    }
    if (type === 'CARD') {
      getAllCardPlaceholders().forEach((el) => el.removeAttribute('style'));
      if (destination) {
        const style = makeCardPlaceholderStyle(source, destination);
        if (style) {
          getCardPlaceholder(destination.droppableId)?.setAttribute(
            'style',
            style
          );
        }
      }
    }
  }, []);
  useLayoutEffect(() => {
    dispatch(boardActions.setCurrentId(boardId));
    if (!isSignedIn) {
      // TODO: reset data;
      return;
    }
    if (boardId) {
      dispatch(columnActions.setLoading(true));
      Promise.all([
        asyncDispatch(boardThunks.fetch(boardId)),
        asyncDispatch(columnThunks.fetchByBoard(boardId)),
        asyncDispatch(cardThunks.fetchByBoard(boardId)),
      ])
        .then(() => {
          dispatch(boardActions.pushRecentBoardId(boardId));
        })
        .finally(() => {
          dispatch(columnActions.setLoading(false));
        });
    }
  }, [boardId, isSignedIn, dispatch, asyncDispatch]);

  console.info('BoardRoute rendering...');
  return (
    <div className={styles.wrapper}>
      <BoardRouteBackground
        color={currentBoard?.color}
        image={currentBoard?.image}
      />
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
                className={classnames(
                  styles.container,
                  snapshot.isDraggingOver ? styles.draggingOver : ''
                )}
                {...provided.droppableProps}>
                <div className={styles.columnPlaceholder} />
                <TransitionGroup component={null}>
                  {currentBoard?.columnOrder
                    .filter((columnId) => columnEntities[columnId])
                    .map((columnId, index) => (
                      <CSSTransition
                        key={columnId}
                        classNames="fade-right"
                        timeout={500}>
                        <Column
                          key={columnId}
                          index={index}
                          data={columnEntities[columnId] as IColumn}
                        />
                      </CSSTransition>
                    ))}
                </TransitionGroup>
                {provided.placeholder}
                <div className={styles.actions}>
                  <ColumnCreator />
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Scrollbars>
      <CreateCardDialog />
    </div>
  );
}

export default memo(BoardRoute);
