import React, { memo, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { Route, Switch, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { auth } from './api/firebase';
import UserSignInDialog from './dialogs/UserSignInDialog';
import { defaultLanguage, messages } from './locales';
import BoardPage from './pages/BoardPage';
import HomePage from './pages/HomePage';
import {
  boardThunks,
  selectAppLanguage,
  userActions,
  useReduxDispatch,
  useReduxSelector,
} from './redux';

function App() {
  const location = useLocation();
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
      <TransitionGroup component={null}>
        <CSSTransition key={location.pathname} classNames="page" timeout={500}>
          <Switch location={location}>
            <Route exact path="/board/:id" component={BoardPage} />
            <Route path="/" component={HomePage} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
      <UserSignInDialog />
    </IntlProvider>
  );
}

export default memo(App);
