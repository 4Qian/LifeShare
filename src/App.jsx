import { useEffect, useReducer } from 'react';
import './App.css';
import { LOGIN_STATUS, CLIENT, SERVER, ACTIONS } from './constants';
import { fetchSession, fetchLogin, fetchLogout } from './services';
import LoginForm from './LoginForm';
import Loading from './Loading';
import AddNewPost from './AddNewPost';
import PostDetail from './PostDetail';
import Discover from './Discover';
import Profile from './Profile';
import Menu from './Menu';
import reducer, { initialState } from './reducer';

function App() {

  const [state, dispatch] = useReducer(reducer, initialState);

  function onLogin(username) {
    dispatch({ type: ACTIONS.PENDING_LOGIN_STATUS });
    fetchLogin(username)
      .then(fetchedUsername => {
        dispatch({ type: ACTIONS.LOG_IN, username });
        dispatch({ type: ACTIONS.RESET_PAGE });
      })
      .catch(err => {
        dispatch({ type: ACTIONS.LOG_IN_FAILED, error: err?.error })
      });
  }

  function onLogout() {
    dispatch({ type: ACTIONS.PENDING_LOGIN_STATUS });
    fetchLogout()
      .then(resp => {
        dispatch({ type: ACTIONS.LOG_OUT })
        dispatch({ type: ACTIONS.RESET_PAGE });
      })
      .catch(err => {
        dispatch({ type: ACTIONS.LOG_OUT, error: err?.error });
      });
  }

  function checkForSession() {
    dispatch({ type: ACTIONS.PENDING_LOGIN_STATUS });
    fetchSession()
      .then(session => {
        dispatch({ type: ACTIONS.LOG_IN, username: session.username })
      })
      .catch(err => {
        if (err?.error === SERVER.AUTH_MISSING) {
          return Promise.reject({ error: CLIENT.NO_SESSION })
        }
        return Promise.reject(err);
      })
      .catch(err => {
        dispatch({ type: ACTIONS.CHECK_SESSION_FAILED, error: err?.error });
      });
  }

  useEffect(
    () => {
      checkForSession();
    },
    []
  );

  return (
    <div className="app">
      <main>
        {state.loginStatus === LOGIN_STATUS.PENDING
          && <Loading className="login-waiting">Loading...</Loading>}
        <div className="content-login-page">
          {state.loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && <LoginForm onLogin={onLogin} state={state} dispatch={dispatch} />}
          {state.loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && (
            <div className="discover-not-logged-in">
              {state.subview === 'discoverView' && <Discover disableDetail={true} state={state} dispatch={dispatch} />}
            </div>
          )}
        </div>

        {state.loginStatus === LOGIN_STATUS.IS_LOGGED_IN && (
          <div className="content" >
            <Menu dispatch={dispatch} onLogout={onLogout} />
            {state.subview === 'discoverView' && <Discover disableDetail={false} state={state} dispatch={dispatch} />}
            {state.subview === 'postDetailView' && <PostDetail curPostId={state.curPostId} dispatch={dispatch} />}
            {state.subview === 'addPostView' && <AddNewPost dispatch={dispatch} />}
            {state.subview === 'profileView' && <Profile dispatch={dispatch} username={state.username} />}
          </div>
        )}
      </main >
    </div >
  );
}

export default App;






