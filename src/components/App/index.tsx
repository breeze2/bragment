import { Layout } from 'antd';
import { memo, useEffect } from 'react';
import { IntlProvider } from 'react-intl';

import { auth } from '../../api/firebase';
import UserSignInDialog from '../../dialogs/UserSignInDialog';
import { defaultLanguage, messages } from '../../i18n';
import {
  boardThunks,
  selectAppLanguage,
  userActions,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';
import Content from '../Content';
import Header from '../Header';
import Navigator from '../Navigator';
import styles from './index.module.scss';

function App() {
  const language = useReduxSelector(selectAppLanguage);
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
          <Content />
        </Layout>
      </Layout>
      <UserSignInDialog />
    </IntlProvider>
  );
}

export default memo(App);
