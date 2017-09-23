import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <div className="container">
            <a
              href="#"
              className="left brand-logo"
              style={{ marginLeft: '0.5em' }}
            >
              SurveyButler
            </a>
            <ul className="right">
              <li>
                <a>Login With Google</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
