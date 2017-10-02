// SurveyForm shows a form to add user input
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import SurveyField from './SurveyField';
import { Link } from 'react-router-dom';
import validateEmails from '../../utils/validateEmails';

import formFields from './formFields';

class SurveyForm extends Component {
  renderFields() {
    return formFields.map(({ name, label }) => (
      <Field
        key={name}
        type="text"
        name={name}
        label={label}
        component={SurveyField}
      />
    ));
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red lighten-2 btn-flat white-text">
            Cancel
          </Link>
          <button
            type="submit"
            className="teal lighten-2 btn-flat right white-text"
          >
            Review
            <i className="material-icons right">arrow_forward</i>
          </button>
        </form>
      </div>
    );
  }
}

// Form validation to pass into reduxForm()
function validate(values) {
  // Create errors object
  const errors = {};

  // Email validation errors
  errors.emails = validateEmails(values.emails || '');

  // Validate each field for existence
  formFields.forEach(({ name }) => {
    if (!values[name]) {
      errors[name] = `You must provide a value`;
    }
  });

  // Return errors, if any - passes to matching Field as a prop
  return errors;
}

export default reduxForm({
  validate,
  form: 'surveyForm',
  destroyOnUnmount: false
})(SurveyForm);
