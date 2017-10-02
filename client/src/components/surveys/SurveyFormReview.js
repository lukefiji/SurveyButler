// SurveyFormReview shows users their form inputs for review
import React from 'react';
import { connect } from 'react-redux';

import formFields from './formFields';

const SurveyFormReview = ({ onCancel, formValues }) => {
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
        <i className="material-icons">arrow_back</i>
        Back
      </button>
    </div>
  );
};

// Access survey forms
function mapStateToProps(state) {
  return { formValues: state.form.surveyForm.values };
}

export default connect(mapStateToProps)(SurveyFormReview);
