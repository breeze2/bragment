import { Layout } from 'antd';
import React, { memo, useCallback, useLayoutEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { IFragmentColumn } from '../../api/types';
import { getRegularUrl, getThumbUrl } from '../../api/unsplash';
import FragmentColumn from '../../components/FragmentColumn';
import FragmentColumnCreator from '../../components/FragmentColumn/Creator';
import Header from '../../components/Header';
import GistFormDialog from '../../dialogs/GistFormDialog';
import {
  asyncDispatch,
  asyncFetchCurrentBoard,
  asyncMoveFragmentCard,
  asyncMoveFragmentColumn,
  setIsLoadingFragments,
} from '../../redux/actions';
import { IReduxState } from '../../redux/types';
import styles from '../../styles/BoardPage.module.scss';
import { debounce } from '../../utils';
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
  const currentBoard = useSelector((state: IReduxState) => state.board.current);
  const fragmentColumnMap = useSelector(
    (state: IReduxState) => state.fragment.columnMap
  );
  const dispatch = useDispatch();

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, type } = result;
      if (type === 'COLUMN' && destination) {
        const fromId = getColumnWrapperId(source.index);
        const toId = getColumnWrapperId(destination.index);
        getColumnPlaceholder()?.removeAttribute('style');
        if (fromId && toId) {
          asyncDispatch(dispatch, asyncMoveFragmentColumn(fromId, toId));
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
          asyncDispatch(
            dispatch,
            asyncMoveFragmentCard(
              source.droppableId,
              fromId,
              destination.droppableId,
              toId
            )
          );
        }
      }
    },
    [dispatch]
  );
  const handleDragStart = useCallback((initial: DragStart) => {
    const { type } = initial;
    if (type === 'CARD') {
      const style = makeCardPlaceholderStyle(initial.source, initial.source);
      if (style) {
        getCardPlaceholder(initial.source.droppableId)?.setAttribute(
          'style',
          style
        );
      }
    } else if (type === 'COLUMN') {
      const style = makeColumnPlaceholderStyle(initial.source, initial.source);
      if (style) {
        getColumnPlaceholder()?.setAttribute('style', style);
      }
    }
  }, []);
  const handleDragUpdate = useCallback(
    debounce((initial: DragUpdate) => {
      if (initial.destination) {
        if (initial.type === 'COLUMN') {
          const style = makeColumnPlaceholderStyle(
            initial.source,
            initial.destination
          );
          const placeholder = getColumnPlaceholder();
          if (style) {
            placeholder?.setAttribute('style', style);
          } else {
            placeholder?.removeAttribute('style');
          }
        }
      }
      if (initial.type === 'CARD') {
        getAllCardPlaceholders().forEach((el) => el.removeAttribute('style'));
        if (initial.destination) {
          const style = makeCardPlaceholderStyle(
            initial.source,
            initial.destination
          );
          if (style) {
            getCardPlaceholder(initial.destination.droppableId)?.setAttribute(
              'style',
              style
            );
          }
        }
      }
    }, 20),
    []
  );
  useLayoutEffect(() => {
    if (boardId) {
      dispatch(setIsLoadingFragments(true));
      asyncDispatch(dispatch, asyncFetchCurrentBoard(boardId)).finally(() => {
        dispatch(setIsLoadingFragments(false));
      });
    }
  }, [boardId, dispatch]);

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
                  {currentBoard?.columnOrder
                    .filter((columnId) => fragmentColumnMap.has(columnId))
                    .map((columnId, index) => (
                      <FragmentColumn
                        key={columnId}
                        index={index}
                        data={
                          fragmentColumnMap.get(columnId) as IFragmentColumn
                        }
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
        <GistFormDialog />
      </Layout.Content>
    </Layout>
  );
}

export default memo(BoardPage);
