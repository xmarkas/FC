import React, { Component } from "react";
import { connect } from "react-redux";
// import { oktaSession } from "../store/actions/index";
import { session, getToken, signOut } from "../util/okta";
import { Link, Redirect, Route } from "react-router-dom";


const mapStateToProps = state => {
  return {
    sessionExists: state.sessionExists,
    provisional: state.provisional,
    user: state.user,
    tokenExpiresAt: state.tokenExpiresAt,
    expiringSession: state.expiringSession
  };
};

function mapDispatchToProps(dispatch) {
  return {};
}

class UserStatus extends Component {
  state = {
    userMenu: false
  };

  componentWillMount() {
    session();
  }

  userMenu = () => {
    console.log("clicked");
    this.setState({ userMenu: this.state.userMenu ? false : true });
  };

  continueSession = () => {
    getToken({ user: { profile: { login: this.props.user.email } } });
  };

  endSession = () => {
    signOut();
  };

  render() {
    return (
      <React.Fragment>
        {/* WARNING - SESSION EXPIRING */}
        {this.props.expiringSession && (
          <div className="session-exp-warning">
            <span style={{ color: "red" }}>
              Your session is about to expire!
            </span>
            <div className="d-flex justify-content-around mt-5">
              <button
                className="btn btn-sm btn-danger"
                onClick={this.endSession}
              >
                Log Out
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={this.continueSession}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        {/* REDIRECT SIGNED IN USER */}
        {this.props.user && (
          <Route>
            <Redirect to={{ pathname: "/dashboard" }}></Redirect>
          </Route>
        )}
        {/* USER SIGNED OUT REDIRECT */}
        {!this.props.user && (
          <Route>
            <Redirect to={{ pathname: "/" }}></Redirect>
          </Route>
        )}
        {/* User sign in/create account */}
        {!this.props.user && (
          <React.Fragment>
            <span
              id="open-account"
              className="nav-item nav-link"
              onClick={this.props.createAccount}
            >
              Create Account
            </span>
            <span id="open-signin" className="nav-item nav-link">
              <Link to="/SignIn" className="link-gray">
                Log In
              </Link>
            </span>
          </React.Fragment>
        )}
        {/* User signed in */}
        {this.props.user && (
          <div>
            <div
              onClick={this.userMenu}
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative"
              }}
            >
              {this.props.user.image_url && (
                <div className="img-wrap-xs mr-1">
                  <img
                    src={`/Profile_Images/${this.props.user.image_url}`}
                    style={{ width: "inherit" }}
                  ></img>
                </div>
              )}
              {!this.props.user.image_url && (
                <i className="fas fa-user-circle fa-2x mr-1 fc-green"></i>
              )}
              <span id="user" style={{ color: "dimgray" }}>
                {this.props.user.first_name}
              </span>
              <i className="fas fa-caret-down ml-3"></i>
              {this.state.userMenu && (
                <div id="user-menu">
                  <ul style={{ listStyle: "none", padding: "10px" }}>
                    <li
                      style={{ cursor: "pointer" }}
                      onClick={this.endSession}
                    >
                      Sign Out
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      onClick={this.tokenExpireCheck}
                    >
                      Settings
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserStatus);
