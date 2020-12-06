import React, { useState } from 'react';

import { useStore } from '../store';
import Errors from './Errors';

const USER_LOGIN = `
  mutation userLogin($input: AuthInput!) {
    userLogin(input: $input) {
      errors {
        message
      }
      user {
        id
        username
      }
      authToken
    }
  }
`;

export default function Login() {
  const { request, setLocalAppState } = useStore();
  const [uiErrors, setUIErrors] = useState();
  const handleLogin = async (event) => {
    event.preventDefault();
    const input = event.target.elements;
    const { data } = await request(USER_LOGIN, {
      variables: {
        input: {
          username: input.username.value,
          password: input.password.value,
        },
      },
    });
    const { errors, user, authToken } = data.userLogin;
    if (errors.length > 0) {
      return setUIErrors(errors);
    }
    user.authToken = authToken;
    window.localStorage.setItem('azdev:user', JSON.stringify(user));
    setLocalAppState({ user, component: { name: 'Home' } });
  };
  return (
    <div className="sm-container">
      <form method="POST" onSubmit={handleLogin}>
        <div className="form-entry">
          <label>
            USERNAME
            <input type="text" name="username" required />
          </label>
        </div>
        <div className="form-entry">
          <label>
            PASSWORD
            <input type="password" name="password" required />
          </label>
        </div>
        <Errors errors={uiErrors} />
        <div className="spaced">
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
