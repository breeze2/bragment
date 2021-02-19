import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { memo, useLayoutEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import BoardCard from '../../components/Board';
import BoardCardCreator from '../../components/Board/Creator';
import { useFormatMessage } from '../../components/hooks';
import CreateBoardDialog from '../../dialogs/CreateBoardDialog';
import {
  boardActions,
  boardThunks,
  selectPersonalBoardList,
  selectRecentlyBoardList,
  selectUserSignedIn,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';

import styles from './index.module.scss';

function BoardsRoute() {
  const dispatch = useReduxDispatch();
  const f = useFormatMessage();
  const isSignedIn = useReduxSelector(selectUserSignedIn);
  const personalList = useReduxSelector(selectPersonalBoardList);
  const recentList = useReduxSelector(selectRecentlyBoardList);

  useLayoutEffect(() => {
    if (!isSignedIn) {
      // TODO: reset data
      return;
    }
    dispatch(boardActions.setLoading(true));
    dispatch(boardThunks.fetchAll()).finally(() => {
      dispatch(boardActions.setLoading(false));
    });
  }, [dispatch, isSignedIn]);

  return (
    <div className={styles.wrapper}>
      <Scrollbars autoHide>
        <div className={styles.container}>
          <div className={styles.boardList}>
            <Row gutter={[12, 12]}>
              <Col lg={6} md={8} sm={12} xs={24}>
                <BoardCardCreator />
              </Col>
            </Row>
          </div>
          {recentList.length > 0 && (
            <div className={styles.boardList}>
              <p className={styles.boardListLabel}>
                <ClockCircleOutlined />
                {f('recent')}
              </p>
              <TransitionGroup className="ant-row">
                {recentList.map((board) => (
                  <CSSTransition
                    key={board.id}
                    in={true}
                    appear={true}
                    classNames="fade-right"
                    timeout={500}>
                    <Col lg={6} md={8} sm={12} xs={24}>
                      <Link to={`/board/${board.id}`}>
                        <BoardCard board={board} />
                      </Link>
                    </Col>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          )}
          {personalList.length > 0 && (
            <div className={styles.boardList}>
              <p className={styles.boardListLabel}>
                <UserOutlined />
                {f('personal')}
              </p>
              <TransitionGroup className="ant-row">
                {personalList.map((board) => (
                  <CSSTransition
                    key={board.id}
                    in={true}
                    appear={true}
                    classNames="fade-right"
                    timeout={500}>
                    <Col lg={6} md={8} sm={12} xs={24}>
                      <Link to={`/board/${board.id}`}>
                        <BoardCard board={board} />
                      </Link>
                    </Col>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          )}
        </div>
      </Scrollbars>
      <CreateBoardDialog />
    </div>
  );
}

export default memo(BoardsRoute);
