import { Layout } from 'antd';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from '../../components/Header';
import Navigator from '../../components/Navigator';
import BoardsPage from '../Boards';
import SettingsPage from '../Settings';
import styles from './styles.module.scss';

const Home: React.FC = React.memo(() => {
  return (
    <Layout className={styles.layout}>
      <Navigator />
      <Layout>
        <Header />
        <Switch>
          <Route path="/settings" component={SettingsPage} />
          <Route path={['/boards', '/']} component={BoardsPage} />
        </Switch>
      </Layout>
    </Layout>
  );
});

export default Home;
