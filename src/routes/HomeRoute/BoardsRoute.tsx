import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { memo, useLayoutEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars';

import BoardCardCreator from '../../components/Board/Creator';
import BoardList from '../../components/Board/List';
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
          <div className={styles.boardCreatorWrapper}>
            <Row gutter={[12, 12]}>
              <Col lg={6} md={8} sm={12} xs={24}>
                <BoardCardCreator />
              </Col>
            </Row>
          </div>
          {recentList.length > 0 && (
            <BoardList
              icon={<ClockCircleOutlined />}
              label={f('recent')}
              boards={recentList}
            />
          )}
          {personalList.length > 0 && (
            <BoardList
              icon={<UserOutlined />}
              label={f('personal')}
              boards={personalList}
            />
          )}
        </div>
      </Scrollbars>
      <CreateBoardDialog />
    </div>
  );
}

export default memo(BoardsRoute);
