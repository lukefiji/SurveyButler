// SurveyField contains logic to contain a single field
import React from 'react';

// Being rendered by Field tag - have access to all its props
export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBottom: '0.25em' }} />
      <div
        className="red-text text-lighten-3"
        style={{ marginBottom: '1.25em' }}
      >
        {touched && error}
      </div>
    </div>
  );
};
