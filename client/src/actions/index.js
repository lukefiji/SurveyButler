import axios from 'axios';

import { FETCH_USER, FETCH_SURVEYS } from './actionTypes';

// Utilizing redux-thunk for an async action
export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current-user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

// Handle Stripe payment to DB
export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  // User model is automatically updated upon successful db change
  dispatch({ type: FETCH_USER, payload: res.data });
};

// Submit survey to db
export const submitSurvey = (values, history) => async dispatch => {
  // Make a post request to API with values from redux form
  const res = await axios.post('/api/surveys', values);

  // Comes from withRouter() HOC from SurveyFormReview
  history.push('/surveys');

  // Update user model
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys/');

  dispatch({ type: FETCH_SURVEYS, payload: res.data });
};
