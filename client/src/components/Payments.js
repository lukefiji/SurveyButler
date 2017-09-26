import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';

// Set up Stripe Checkout settings via a HOC
class Payments extends Component {
  render() {
    // Use child component to restyle button
    return (
      <StripeCheckout
        name="SurveyButler"
        description="5 email credits for $5"
        amount={500}
        token={token => this.props.handleToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_PUB_KEY}
      >
        <button className="btn">Add Credits</button>
      </StripeCheckout>
    );
  }
}

export default connect(null, actions)(Payments);
