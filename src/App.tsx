import React, { memo, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import SignInDialog from './dialogs/SignInDialog';
import { defaultLanguage, messages } from './locales';
import BoardPage from './pages/BoardPage';
import HomePage from './pages/HomePage';
import { asyncFetchBoardBgImages } from './redux/actions';
import { IReduxState } from './redux/types';

function App() {
  const location = useLocation();
  const language = useSelector((state: IReduxState) => state.common.language);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(asyncFetchBoardBgImages());
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
      <SignInDialog />
    </IntlProvider>
  );
}

export default memo(App);
