import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Layout, Row } from 'antd';
import React, { memo, useLayoutEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import BoardCard from '../../components/BoardCard';
import BoardCardCreator from '../../components/BoardCard/Creator';
import CreateBoardDialog from '../../dialogs/CreateBoardDialog';
import {
  asyncDispatch,
  asyncFetchPersonalBoards,
  setBoardLoading,
} from '../../redux/actions';
import { IReduxState } from '../../redux/types';

import styles from '../../styles/HomePage.module.scss';

function BoardsPage() {
  const dispatch = useDispatch();
  const { formatMessage: f } = useIntl();
  const personalList = useSelector(
    (state: IReduxState) => state.board.personalList
  );
  const recentList = useSelector(
    (state: IReduxState) => state.board.recentList
  );

  useLayoutEffect(() => {
    dispatch(setBoardLoading(true));
    asyncDispatch(dispatch, asyncFetchPersonalBoards()).finally(() => {
      dispatch(setBoardLoading(false));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout.Content className={styles.content}>
      <div className={styles.boardList}>
        <Row gutter={[12, 12]}>
          <Col lg={6} md={8} sm={12} xs={24}>
            <BoardCardCreator />
          </Col>
        </Row>
      </div>
      {recentList.size > 0 && (
        <div className={styles.boardList}>
          <p className={styles.boardListLabel}>
            <ClockCircleOutlined />
            {f({ id: 'recent' })}
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
      {personalList.size > 0 && (
        <div className={styles.boardList}>
          <p className={styles.boardListLabel}>
            <UserOutlined />
            {f({ id: 'personal' })}
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
      <CreateBoardDialog />
    </Layout.Content>
  );
}

export default memo(BoardsPage);
