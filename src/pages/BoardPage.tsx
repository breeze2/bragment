import { Layout } from 'antd';
import React from 'react';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getBoardImageURL } from '../api/board';
import FragmentColumn from '../components/FragmentColumn';
import Header from '../components/Header';
import { asyncFetchCurrentBoard } from '../redux/actions';
import { IReduxState } from '../redux/types';

import styles from '../styles/BoardPage.module.scss';

interface IBoardPageRouteParams {
  id?: string;
}

interface IBoardPageProps extends RouteComponentProps<IBoardPageRouteParams> {}

const BoardPage: React.FC<IBoardPageProps> = React.memo(props => {
  const dispatch = useDispatch();
  const currentBoard = useSelector((state: IReduxState) => state.board.current);
  const handleDragEnd = () => undefined;
  const boardID = props.match.params.id;
  React.useEffect(() => {
    if (boardID) {
      dispatch(asyncFetchCurrentBoard(parseInt(boardID, 10)));
    }
  }, [boardID, dispatch]);

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
                <FragmentColumn
                  index={0}
                  boardID={boardID || ''}
                  title={'demo'}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Layout.Content>
    </Layout>
  );
});

export default BoardPage;
