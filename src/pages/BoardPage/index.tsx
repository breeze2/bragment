import { Layout } from 'antd';
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
import ProgressiveImage from 'react-progressive-image';
import { RouteComponentProps } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { IFragmentColumn } from '../../api/types';
import { getRegularUrl, getThumbUrl } from '../../api/unsplash';
import FragmentColumn from '../../components/FragmentColumn';
import FragmentColumnCreator from '../../components/FragmentColumn/Creator';
import Header from '../../components/Header';
import CreateFragmentDialog from '../../dialogs/CreateFragmentDialog';
import {
  boardActions,
  boardThunks,
  fragmentCardThunks,
  fragmentColumnActions,
  fragmentColumnThunks,
  selectBoardEntities,
  selectCurrentUserId,
  selectFragmentColumnEntities,
  useReduxAsyncDispatch,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';
import styles from '../../styles/BoardPage.module.scss';
import {
  getAllCardPlaceholders,
  getCardPlaceholder,
  getCardWrapperId,
  getColumnPlaceholder,
  getColumnWrapperId,
  makeCardPlaceholderStyle,
  makeColumnPlaceholderStyle,
} from './helpers';

interface IBoardPageRouteParams {
  id?: string;
}

interface IBoardPageProps extends RouteComponentProps<IBoardPageRouteParams> {}

function BoardPage(props: IBoardPageProps) {
  const boardId = props.match.params.id;
  const dispatch = useReduxDispatch();
  const asyncDispatch = useReduxAsyncDispatch();
  const boardEntities = useReduxSelector(selectBoardEntities);
  const userId = useReduxSelector(selectCurrentUserId);
  const fragmentColumnEntities = useReduxSelector(selectFragmentColumnEntities);
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
            fragmentColumnThunks.moveCard({
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
    if (!userId) {
      // TODO: reset data;
      return;
    }
    if (boardId) {
      dispatch(fragmentColumnActions.setLoading(true));
      Promise.all([
        asyncDispatch(boardThunks.fetch(boardId)),
        asyncDispatch(fragmentColumnThunks.fetchByBoard(boardId)),
        asyncDispatch(fragmentCardThunks.fetchByBoard(boardId)),
      ]).finally(() => {
        dispatch(fragmentColumnActions.setLoading(false));
      });
    }
  }, [boardId, userId, dispatch, asyncDispatch]);

  let progressiveImage;
  if (currentBoard && currentBoard.image) {
    const { color, image } = currentBoard;
    const regularImage = getRegularUrl(image);
    const thumbImage = getThumbUrl(image);
    const placeholder = (
      <div
        className={styles.background}
        style={{
          filter: 'blur(10px)',
          backgroundColor: color || undefined,
          backgroundImage: thumbImage ? `url(${thumbImage})` : undefined,
        }}
      />
    );
    progressiveImage = (
      <ProgressiveImage src={regularImage} placeholder={thumbImage}>
        {(src: string, loading: boolean) =>
          loading ? (
            placeholder
          ) : (
            <div
              className={styles.background}
              style={{
                backgroundColor: color || undefined,
                backgroundImage: src ? `url(${src})` : undefined,
              }}
            />
          )
        }
      </ProgressiveImage>
    );
  }

  console.info('BoardPage rendering...');
  return (
    <Layout className={styles.layout}>
      {progressiveImage}
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
                  <TransitionGroup component={null}>
                    {currentBoard?.columnOrder
                      .filter((columnId) => fragmentColumnEntities[columnId])
                      .map((columnId, index) => (
                        <CSSTransition
                          key={columnId}
                          classNames="fade-right"
                          timeout={500}>
                          <FragmentColumn
                            key={columnId}
                            index={index}
                            data={
                              fragmentColumnEntities[
                                columnId
                              ] as IFragmentColumn
                            }
                          />
                        </CSSTransition>
                      ))}
                  </TransitionGroup>
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
      <CreateFragmentDialog />
    </Layout>
  );
}

export default memo(BoardPage);
