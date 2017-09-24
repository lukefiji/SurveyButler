import { FETCH_USER } from '../actions/actionTypes';

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      // Return id if if logged in, false if nothing
      return action.payload || false;
    default:
      return state;
  }
}
