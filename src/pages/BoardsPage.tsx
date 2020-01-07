import { UserOutlined } from '@ant-design/icons';
import { Col, Layout, Row } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import BoardCard from '../components/cards/BoardCard';
import CreateBoardCard from '../components/cards/CreateBoardCard';
import CreateBoardDialog from '../components/dialogs/CreateBoardDialog';
import { asyncFetchAllBoards } from '../redux/actions';
import { IReduxState } from '../redux/types';

import styles from '../styles/BoardsPage.module.scss';

const BoardsPage: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { formatMessage: f } = useIntl();
  const personalList = useSelector(
    (state: IReduxState) => state.board.personalList
  );
  // const recentList = useSelector(
  //   (state: IReduxState) => state.board.recentList
  // );
  React.useEffect(() => {
    dispatch(asyncFetchAllBoards());
  }, [dispatch]);
  return (
    <Layout.Content className={styles.content}>
      <div className={styles.list}>
        <p className={styles.listLabel}>
          <UserOutlined />
          {f({ id: 'personal' })}
        </p>
        <Row gutter={12} className={styles.listGrid}>
          {personalList.map(board => (
            <Col key={board.id} lg={6} md={8} sm={12} xs={24}>
              <Link to={`/board/${board.id}`}>
                <BoardCard board={board} />
              </Link>
            </Col>
          ))}
          <Col lg={6} md={8} sm={12} xs={24}>
            <CreateBoardCard />
          </Col>
        </Row>
      </div>
      <CreateBoardDialog />
    </Layout.Content>
  );
});

export default BoardsPage;
