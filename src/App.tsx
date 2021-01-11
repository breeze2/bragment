import { Layout } from 'antd';
import { memo, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { Route, Switch, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { auth } from './api/firebase';
import Header from './components/Header';
import Navigator from './components/Navigator';
import UserSignInDialog from './dialogs/UserSignInDialog';
import { defaultLanguage, messages } from './locales';
import {
  boardThunks,
  selectAppLanguage,
  userActions,
  useReduxDispatch,
  useReduxSelector,
} from './redux';
import { EAppRoute } from './redux/types';
import BoardRoute from './routes/BoardRoute';
import HomeRoute from './routes/HomeRoute';
import styles from './styles/App.module.scss';

function App() {
  const language = useReduxSelector(selectAppLanguage);
  const location = useLocation();
  const dispatch = useReduxDispatch();
  useEffect(() => {
    dispatch(boardThunks.fetchBgImages());
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          userActions.setCurrentUser(user.uid, {
            displayName: user.displayName || undefined,
            photoUrl: user.photoURL || undefined,
            email: user.email || undefined,
            emailVerified: user.emailVerified,
            uid: user.uid,
          })
        );
      } else {
        dispatch(userActions.setCurrentUser(undefined, undefined));
      }
    });
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <IntlProvider
      locale={language}
      messages={messages[language] || messages[defaultLanguage]}>
      <Layout className={styles.layout}>
        <Navigator />
        <Layout className={styles.main}>
          <Header />
          <Layout.Content className={styles.content}>
            <TransitionGroup component={null}>
              <CSSTransition
                key={location.pathname}
                classNames="route"
                timeout={500}>
                <Switch location={location}>
                  <Route exact path={EAppRoute.BOARD} component={BoardRoute} />
                  <Route path={EAppRoute.HOME} component={HomeRoute} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </Layout.Content>
        </Layout>
      </Layout>
      <UserSignInDialog />
    </IntlProvider>
  );
}

export default memo(App);
