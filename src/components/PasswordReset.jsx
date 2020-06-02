import React, { Component } from "react";
import { Link, Route, Redirect } from "react-router-dom";

class PasswordReset extends Component {
  state = {
    formHeader: "Password Reset",
    formError: null,
    recoverInput: undefined,
    userFound: false,
    password1: undefined,
    password2: undefined,
    vCode: undefined,
    vCodeInput: undefined
  };

  resetGo = () => {
    let input = this.state.recoverInput;
    if (input === undefined) {
      this.setState({ formError: "No input entered" });
    } else {
      // parse for email or phone
      if (input.includes("@") && input.includes(".")) {
        console.log("email");
        input.trim();
        this.getUser(`profile.email eq "${input}"`);
      } else {
        let format = input.replace(/\W/g, "");
        format = format[0] == 1 ? format.substring(1) : format;
        if (isNaN(format)) {
          this.setState({
            formError: "Input is neither a phone number or email"
          });
        } else if (format.length < 9 || format.length > 11) {
          this.setState({ formError: "Not a valid phone number" });
        } else {
          console.log("phone", format);
          this.getUser(`profile.mobilePhone eq "${format}"`);
        }
      }
    }
  };

  getUser = query => {
    let options = {
      method: "GET",
      mode: "same-origin",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      }
    };

    fetch(`/site/finduser?queryparams=${query}`, options)
      .then(res => {
        if (res) return res.json();
      })
      .then(res => {
        console.log(res);
        this.startChangePasswordFlow(res.login, res.phone);
      })
      .catch(err => {
        console.log(err);
      });
  };

  startChangePasswordFlow = (login, phone) => {
    // Toggle view
    this.setState({ userFound: true, formHeader: "Enter New Password" });
    // Generate 5 digit-verification code
    let verificaiton = Math.floor(Math.random() * 10000) * new Date().getTime();
    let digits = verificaiton.toString().substr(0, 5);
    this.setState({ vCode: digits, login: login });

    // Send digits to profile creator
    let options = {
      method: "POST",
      mode: "same-origin",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ entity: { phone: phone, code: digits } })
    };

    fetch("/site/verify", options)
      .then(res => {
        if (res) return res.json();
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  setPassword = () => {
    // Verification code match
    if (this.state.vCode != this.state.vCodeInput) {
      this.setState({ formError: "5-digit code does not match!" });
      return;
    }

    // Verify password match
    if (this.state.password1 !== this.state.password2) {
      this.setState({
        formError: "Passwords do not match. Please re-type passwords"
      });
      return; // Stop account flow
    } else {
      this.setState({ formError: null });
    }

    // Verify password length
    if (this.state.password1.length < 8) {
      this.setState({ formError: "Passwords must be at least 8 characters!" });
      return;
    }

    // Send request to Okta to change the password on the users account
    let options = {
      method: "POST",
      mode: "same-origin",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        entity: { login: this.state.login, newPassword: this.state.password1 }
      })
    };

    fetch("/site/changepassword", options)
      .then(res => {
        if (res) return res.json();
      })
      .then(res => {
        if (!res.res) {
          this.setState({ formError: res.msg });
        } else {
          this.setState({
            formHeader: "Your password has been reset!",
            redirect: true
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      // <!-- ROW -->
      <div
        id="main-content"
        className="row row-border justify-content-center py-5"
        style={{ position: "relative" }}
      >
        {/* REDIRECT */}
        {this.state.redirect && (
          <div>{this.state.formHeader}
          <Link to='/signin'>
            <button className="btn btn-success ml-3">Log In Now</button>
            </Link>
            </div>
        )}
        {/* Enter phone or email */}
        {!this.state.userFound && !this.state.redirect && (
          <div id="login-help" className="col spartan">
            <div className="row justify-content-center">
              {this.state.formHeader}
            </div>
            <div className="row py-4 justify-content-center">
              <div className="col-md-4">
                <div
                  style={{
                    borderRadius: "5px",
                    padding: "20px",
                    backgroundColor: "white",
                    fontSize: "small"
                  }}
                >
                  {/* <!-- email or phone number --> */}
                  <div className="form-group">
                    <label for="recover-input">
                      Enter an email or phone number associated with the
                      account.
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recover-input"
                      placeholder="email or phone"
                      onChange={ev => {
                        this.setState({ recoverInput: ev.target.value });
                      }}
                    ></input>
                    <small className="text-muted">
                      Phone numbers do not require special characters ("-" or
                      "()")
                    </small>
                  </div>
                  <button
                    id="recover-go"
                    className="btn btn-success"
                    onClick={this.resetGo}
                  >
                    Reset
                  </button>
                  <div
                    id="form-error"
                    className="spartan pt-2"
                    style={{
                      fontSize: "x-small",
                      color: "red",
                      textAlign: "center"
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Enter New password and 5 digit code */}
        {this.state.userFound && !this.state.redirect && (
          <div id="change-password" className="col spartan">
            <div className="row justify-content-center">
              {this.state.formHeader}
            </div>
            <div className="row py-4 justify-content-center">
              <div className="col-md-4">
                <div
                  style={{
                    borderRadius: "5px",
                    padding: "20px",
                    backgroundColor: "white",
                    fontSize: "small"
                  }}
                >
                  {/* <!-- password --> */}
                  <div className="form-group">
                    <label for="InputPassword1">Create Password</label>
                    <div>
                      <small className="text-muted">
                        Must be least 8 characters, a lowercase letter, an
                        uppercase letter, a number, no parts of your username.
                      </small>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      id="InputPassword1"
                      onChange={ev => {
                        this.setState({ password1: ev.target.value });
                      }}
                    ></input>
                  </div>
                  {/* <!-- password verify--> */}
                  <div className="form-group">
                    <label for="InputPassword2">Re-type Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="InputPassword2"
                      onChange={ev => {
                        this.setState({ password2: ev.target.value });
                      }}
                    ></input>
                  </div>
                  {/* <!-- Verificaiton code--> */}
                  <div className="form-group">
                    <label for="v-code">5-digit verification code</label>
                    <div>
                      <small className="text-muted">
                        Sent to phone number associated with your account.
                      </small>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="v-code"
                      onChange={ev => {
                        this.setState({ vCodeInput: ev.target.value });
                      }}
                      style={{ width: "100px" }}
                    ></input>
                  </div>
                  <button
                    id="set-password-go"
                    className="btn btn-success"
                    onClick={this.setPassword}
                  >
                    Change password
                  </button>
                  {this.state.formError && (
                    <div
                      id="password-form-error"
                      className="spartan pt-2"
                      style={{
                        fontSize: "x-small",
                        color: "red",
                        textAlign: "center"
                      }}
                    >
                      {this.state.formError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default PasswordReset;
