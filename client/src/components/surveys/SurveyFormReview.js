// SurveyFormReview shows users their form inputs for review
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';
import formFields from './formFields';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
  // Map over form fields
  const reviewFields = formFields.map(({ name, label }) => {
    return (
      <div key={name}>
        <label>{label}</label>
        <div>{formValues[name]}</div>
      </div>
    );
  });

  return (
    <div>
      <h5>Please confirm your entries</h5>
      {reviewFields}
      <button className="btn-flat grey lighten-2" onClick={onCancel}>
        <i className="material-icons left">arrow_back</i>
        Back
      </button>
      <button
        onClick={() => submitSurvey(formValues, history)}
        className="teal lighten-2 btn-flat white-text right"
      >
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

// Access survey forms
function mapStateToProps(state) {
  return { formValues: state.form.surveyForm.values };
}

// withRouter() HOC provides react router information
export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));
