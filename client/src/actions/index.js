import axios from 'axios';

import { FETCH_USER } from './actionTypes';

// Utilizing redux-thunk for an async action
export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current-user');
  dispatch({ type: FETCH_USER, payload: res.data });
};
