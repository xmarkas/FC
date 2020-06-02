import React, { Component } from "react";
import { Link } from "react-router-dom";
import { signInAuthenticate } from "../util/okta";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    errMsg: null,
    signInProgress: false
  };

  closeSignInWindow = ev => {
    if (ev.target.id === "sign-in-wrapper") this.props.signIn();
  };

  inputEmail = ev => {
    this.setState({ email: ev.target.value });
  };

  inputPassword = ev => {
    this.setState({ password: ev.target.value });
  };

  signInFlow = async () => {
    this.setState({ signInProgress: true });
    let res = await signInAuthenticate(this.state.email, this.state.password);
    if (!res) {
      this.setState({ errMsg: "Incorrect email or password", signInProgress: false });
    }
  };

  render() {
    return (
      // <!-- Sign In  -->

      <React.Fragment>
        <div onClick={ev => this.closeSignInWindow(ev)}>
          <div id="sign-in" style={{ position: "relative" }}>
            {this.state.signInProgress && (
              <div
                class="spinner-border text-info"
                role="status"
                style={{ position: "absolute", top: "50%", left: "45%" }}
              >
                <span class="sr-only">Loading...</span>
              </div>
            )}
            <div className="header spartan">
              <img
                width="40px"
                src={require("../media/logoAlpha.gif")}
                alt=""
              />
              <div>Sign In</div>
            </div>
            <div className="content spartan">
              {/* <!-- email --> */}
              <div className="form-group">
                <label>Email</label>
                <input
                  onChange={ev => this.inputEmail(ev)}
                  type="email"
                  className="form-control"
                  id="sign-in-email"
                ></input>
              </div>
              {/* <!-- password --> */}
              <div className="form-group">
                <label>Password</label>
                <input
                  onChange={ev => this.inputPassword(ev)}
                  onKeyDown={ev => {
                    if (ev.keyCode === 13) this.signInFlow();
                  }}
                  type="password"
                  className="form-control"
                  id="sign-in-password"
                ></input>
              </div>
              <button
                id="signin-go"
                className="btn btn-primary"
                onClick={this.signInFlow}
              >
                Log In
              </button>

              <div
                id="sign-in-form-error"
                className="spartan pt-2"
                style={{
                  fontSize: "x-small",
                  color: "red",
                  textAlign: "center"
                }}
              >
                {this.state.errMsg}
              </div>
              <div id="password-reset" className="py-1">
                <small style={{ fontWeight: "500", cursor: "pointer" }}>
                  <Link to="/passwordreset" className="link-gray">
                    Reset Password
                  </Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SignIn;
