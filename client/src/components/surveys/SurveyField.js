// SurveyField contains logic to contain a single field
import React from 'react';

// Being rendered by Field tag - have access to all its props
export default ({ input, label }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} />
    </div>
  );
};
