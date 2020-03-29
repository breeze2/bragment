import { Layout } from 'antd';
import React from 'react';
import {
  DragDropContext,
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
  asyncFetchCurrentBoard,
  asyncSaveFragmentColumnsData,
  moveFragmentColumn,
} from '../redux/actions';
import { IReduxState } from '../redux/types';

import styles from '../styles/BoardPage.module.scss';

interface IBoardPageRouteParams {
  id?: string;
}

interface IBoardPageProps extends RouteComponentProps<IBoardPageRouteParams> {}

const BoardPage: React.FC<IBoardPageProps> = React.memo((props) => {
  const boardID = props.match.params.id;
  const currentBoard = useSelector((state: IReduxState) => state.board.current);
  const fragmentColumns = useSelector(
    (state: IReduxState) => state.fragment.columns
  );
  const prevProps = usePrevious({ boardID, fragmentColumns });
  const dispatch = useDispatch();
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (destination) {
      dispatch(moveFragmentColumn(source.index, destination.index));
    }
  };
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
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="board" type="COLUMN" direction="horizontal">
              {(
                provided: DroppableProvided,
                snapshot: DroppableStateSnapshot
              ) => (
                <div
                  className={styles.container}
                  ref={provided.innerRef}
                  {...provided.droppableProps}>
                  {fragmentColumns.map((column, index) => (
                    <FragmentColumn
                      key={column.title}
                      index={index}
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
