import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import Config from '../../config';
// import Firebase from 'firebase';
// import Reactfire from 'reactfire';
import * as authActions from 'redux/modules/auth';

@connect(
  state =>({
    user: state.auth.user,
    error: false
  }),
  authActions
)

export default class Register extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    error: PropTypes.string
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const email = this.refs.email.value;
    const pw = this.refs.pw.value;
    const firebase = Config.firebaseRef;
    firebase.auth().createUserWithEmailAndPassword(email, pw).then(function(user) {
      firebase.database().ref('users/').set({
        userid: user.uid,
        email: this.refs.email.value,
        username: this.refs.username.value
      });
    }).catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Error: ' + errorCode + ' ' + errorMessage);
    });
  }

  render() {
    const {user, logout} = this.props;
    const styles = require('./Register.scss');
    return (
      <div className={styles.registerPage + ' container'}>
        <Helmet title="Register"/>
        <h1>Register</h1>
        {!user &&
        <div>
          <form className="register-form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input type="text" ref="email" placeholder="Enter your Email Address" className="form-control" required/>
            </div>
            <div className="form-group">
              <input className="form-control" placeholder="Password" type="password" ref="pw" required />
            </div>
            <div className="form-group">
              <input className="form-control" placeholder="Confirm Password" type="password" ref="pw" required />
            </div>
            <div className="form-group">
              <input className="form-control" placeholder = "Username" type="text" ref="username" required />
            </div>
            <button className="btn btn-success" onClick={this.handleSubmit}><i className="fa fa-sign-in"/>{' '}Log In
            </button>
          </form>
        </div>
        }
        {user &&
        <div>
          <p>You are currently logged in as {user.name}.</p>

          <div>
            <button className="btn btn-danger" onClick={logout}><i className="fa fa-sign-out"/>{' '}Log Out</button>
          </div>
        </div>
        }
      </div>
    );
  }
}
