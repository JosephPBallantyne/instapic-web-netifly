import { AnyAction } from 'redux';
import { LOGIN, LOGOUT } from '../actionTypes';

interface Auth {
  authenticated: boolean;
  username: string | null;
}

function getWithExpiry(key: string) {
  const itemStr = window.localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    window.localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

const refreshedAuth = getWithExpiry('authenticated');
const refreshedUser = getWithExpiry('username');

const initialState: Auth = {
  authenticated: !!refreshedAuth,
  username: refreshedUser || null,
};

const auth = function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case LOGIN: {
      const { username } = action.payload;
      const now = new Date();
      const ttl = 60 * 1000 * 20;
      window.localStorage.setItem(
        'authenticated',
        JSON.stringify({
          value: 'true',
          expiry: now.getTime() + ttl,
        })
      );
      window.localStorage.setItem(
        'username',
        JSON.stringify({
          value: username,
          expiry: now.getTime() + ttl,
        })
      );
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
