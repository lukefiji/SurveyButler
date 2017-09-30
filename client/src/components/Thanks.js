import React from 'react';
import { Link } from 'react-router-dom';

const Thanks = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Thank you!</h1>
      <p>We really appreciate your feedback! 😊</p>
      <Link to="/">Return Home</Link>
    </div>
  );
};

export default Thanks;
