import { useState } from 'react';
import Status from './Status';
import { ACTIONS, SERVER } from './constants';

function LoginForm({ onLogin, state, dispatch }) {

  const [username, setUsername] = useState('');

  function onChange(e) {
    setUsername(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (isValidUsername(username)) {
      onLogin(username);
    } else {
      setUsername('');
      dispatch({ type: ACTIONS.LOG_IN_FAILED, error: SERVER.REQUIRED_USERNAME })
    }
  }

  function isValidUsername(username) {
    let isValid = true;
    isValid = !!username && username.trim();
    isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
    return isValid;
  }

  return (
    <div className="login">
      <img className="logo" src={process.env.PUBLIC_URL + '/images/lifeshare.png'} alt="Logo" />
      <div className="login-guide">Please log in to view the details of the posts!</div>
      <form className="login-form" action="#/login" onSubmit={onSubmit}>
        <label>
          <span>Username: </span>
          <input className="login-username" value={username} onChange={onChange} />
        </label>
        <button className="login-button" type="submit">Login</button>
      </form>
      <div className="username-guide">
        <small className="username-guide-text">
          Your username:<br></br>
        </small>
        <small className="username-guide-text">
          Cannot be empty or be the word "dog".<br></br>
        </small>
        <small className="username-guide-text">
          It must only consist of alphanumeric characters.
        </small>
      </div>
      {state.error && <Status error={state.error} />}
    </div>
  );
}

export default LoginForm;
