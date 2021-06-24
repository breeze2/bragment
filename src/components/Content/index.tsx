import { Layout } from 'antd';
import { memo } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { a, config, useTransition } from 'react-spring';
import { EAppRoute } from '../../redux/types';
import BoardRoute from '../../routes/BoardRoute';
import HomeRoute from '../../routes/HomeRoute';
import styles from './index.module.scss';

interface IContentProps {}

function Content(props: IContentProps) {
  const location = useLocation();
  const transitions = useTransition(location, {
    config: { ...config.gentle, duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  return (
    <Layout.Content className={styles.wrapper}>
      {transitions((style, item) => {
        return (
          <a.div className={styles.animatedContainer} style={style}>
            <Switch location={item}>
              <Route exact path={EAppRoute.BOARD} component={BoardRoute} />
              <Route path={EAppRoute.HOME} component={HomeRoute} />
            </Switch>
          </a.div>
        );
      })}
    </Layout.Content>
  );
}

export default memo(Content);
