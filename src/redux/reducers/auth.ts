import { AnyAction } from 'redux';
import { LOGIN, LOGOUT } from '../actionTypes';

interface Auth {
  authenticated: boolean;
  username: string | null;
}

const refreshedAuth = window.localStorage.getItem('authenticated');
const refreshedUser = window.localStorage.getItem('username');

const initialState: Auth = {
  authenticated: !!refreshedAuth,
  username: refreshedUser || null,
};

const auth = function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case LOGIN: {
      const { username } = action.payload;
      window.localStorage.setItem('authenticated', 'true');
      window.localStorage.setItem('username', username);
      return {
        authenticated: true,
        username,
      };
    }
    case LOGOUT: {
      window.localStorage.removeItem('authenticated');
      window.localStorage.removeItem('username');
      return {
        authenticated: false,
        username: null,
      };
    }
    default:
      return state;
  }
};

export default auth;
