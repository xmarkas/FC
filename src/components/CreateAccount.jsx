import React, { Component } from "react";
import { signInAuthenticate } from "../util/okta";
import { Route, Redirect } from "react-router-dom";

class CreateAccount extends Component {
  state = {
    form: {
      email: "",
      passwordA: "",
      passwordB: "",
      firstName: "",
      lastName: "",
      phoneNumber: ""
    },
    validate: false,
    errMsg: "",
    showVerification: false,
    verificationCode: "",
    verificationCodeInput: "",
    verifyCodeError: "",
    redirectToDash: false,
    signInProgress: false
  };

  setFormData = obj => {
    this.setState(prevState => {
      let form = { ...prevState.form, ...obj };
      return { form: form };
    });
  };

  closeAccountWindow = ev => {
    if (ev.target.id === "account-wrapper") this.props.createAccount();
  };

  startCreateAccount = () => {
    let form = this.state.form;
    let formErrors = 0;
    // High light fields left blank
    Object.keys(form).forEach(key => {
      if (form[key] === "") {
        formErrors++;
      }
    });

    if (formErrors > 0) {
      // Stop account flow on form errors
      this.setState({ validate: true });
      console.log("error");
      return;
    }

    // Verify email
    if (!form.email.includes("@") || !form.email.includes(".")) {
      this.setState({ errMsg: "Email is not valid" });
      return;
    }

    // Verify password match
    if (form.passwordA !== form.passwordB) {
      this.setState({
        errMsg: "Passwords do not match. Please re-type passwords"
      });
      return; // Stop account flow
    } else {
      this.setState({ errMsg: "" });
    }

    // Verify containt upper and lower case and a number
    let matchEXP = /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/;
    if (!form.passwordA.match(matchEXP)) {
      this.setState({ errMsg: "Password does not meet criteria!" });
      return;
    }

    // Verify password length
    if (form.passwordA.length < 8) {
      this.setState({ errMsg: "Passwords must be at least 8 characters!" });
      return;
    }

    // Verify phone number
    let format = form.phoneNumber.replace(/\W/g, "");
    format = format[0] == 1 ? format.substring(1) : format;

    if (format.length < 10 || format.length > 10) {
      this.setState({ errMsg: "Not a valid phone number" });
      return;
    } else {
      console.log("phone", format);
    }

    this.verifyAccount();
  };

  verifyAccount = () => {
    this.setState({
      showVerification: true,
      errMsg: "",
      verificationCodeInput: "",
      verifyCodeError: ""
    });

    /**** TESTING */
    // return;

    // Generate 5 digit-verification code
    let verificaiton = Math.floor(Math.random() * 10000) * new Date().getTime();
    let digits = verificaiton.toString().substr(0, 5);
    this.setState({ verificationCode: digits });

    // Send digits to profile creator
    var options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + this.props.provisional,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        entity: { phone: this.state.form.phoneNumber, code: digits }
      })
    };

    fetch("/site/verify", options)
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log(res);
      });
  };

  verifyCode = () => {
    // Accept verification input
    if (this.state.verificationCodeInput === this.state.verificationCode) {
      this.insertUser();
      console.log("ACCOUNT/PHONE VERIFIED");
    } else {
      this.setState({
        verifyCodeError: "The digits you entered do not match!"
      });
    }
  };

  /**
   * function:        Insert User
   *
   * User account form is sent to Okta via server
   * @param {*} data
   */
  insertUser = () => {
    this.setState({ signInProgress: true });
    let data = {
      firstName: this.state.form.firstName,
      lastName: this.state.form.lastName,
      email: this.state.form.email,
      phoneNumber: this.state.form.phoneNumber,
      password: this.state.form.passwordA
    };

    // console.log("provisional", this.props.provisional);
    var options = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        entity: JSON.stringify(data)
      })
    };

    fetch("/site/createOktaAccount", options)
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (!res.success) {
          // Return to account detail and display error message
          console.log(res);
          this.setState({
            showVerification: false,
            errMsg: res.msg
          });
        } else {
          fetch("/site/createFCAccount", options)
            .then(res => {
              if (res) return res.json();
            })
            .then(res => {
              if (res.success) {
                this.signInUser();
              }
            });
        }
      });
  };

  signInUser = async () => {
    let res = await signInAuthenticate(
      this.state.form.email,
      this.state.form.passwordA
    );

    // On successful account creation redirct to dashboard
    if (res) {
      this.setState({ redirectToDash: true, showVerification: false });
      this.props.createAccount();
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.redirectToDash && (
          <Route>
            <Redirect to={{ pathname: "/dashboard" }}></Redirect>
          </Route>
        )}
        {/* // <!-- Create Account --> */}
        <div id="account-wrapper" onClick={ev => this.closeAccountWindow(ev)}>
          <div id="create-account">
            <div className="header spartan">
              <img
                width="40px"
                src={require("../media/logoAlpha.gif")}
                alt=""
              />
              <div>Create Account</div>
            </div>
            {!this.state.showVerification && (
              <div id="create-account-form" className="spartan content">
                {/* <!-- email --> */}
                <div className="form-group">
                  <label>Email address</label>
                  <input
                    value={this.state.form.email}
                    onChange={ev =>
                      this.setFormData({ email: ev.target.value })
                    }
                    type="email"
                    className={
                      this.state.validate && this.state.form.email === ""
                        ? "form-control require"
                        : "form-control"
                    }
                    id="email"
                    aria-describedby="emailHelp"
                  ></input>
                  <small id="emailHelp" className="form-text text-muted">
                    We'll never share your email with anyone else.
                  </small>
                </div>
                {/* <!-- password --> */}
                <div className="form-group">
                  <label>Create Password</label>
                  <div>
                    <small className="text-muted">
                      Must be least 8 characters, a lowercase letter, an
                      uppercase letter, a number, no parts of your username.
                    </small>
                  </div>
                  <input
                    value={this.state.form.passwordA}
                    onChange={ev =>
                      this.setFormData({ passwordA: ev.target.value })
                    }
                    type="password"
                    className={
                      this.state.validate && this.state.form.passwordA === ""
                        ? "form-control require"
                        : "form-control"
                    }
                    id="InputPassword1"
                  ></input>
                </div>
                {/* <!-- password verify --> */}
                <div className="form-group">
                  <label>Re-type Password</label>
                  <input
                    value={this.state.form.passwordB}
                    onChange={ev =>
                      this.setFormData({ passwordB: ev.target.value })
                    }
                    type="password"
                    className={
                      this.state.validate && this.state.form.passwordB === ""
                        ? "form-control require"
                        : "form-control"
                    }
                    id="InputPassword2"
                  ></input>
                </div>
                {/* <!-- first name --> */}
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className={
                      this.state.validate && this.state.form.firstName === ""
                        ? "form-control require"
                        : "form-control"
                    }
                    id="fname"
                    value={this.state.form.firstName}
                    onChange={ev =>
                      this.setFormData({ firstName: ev.target.value })
                    }
                  ></input>
                </div>
                {/* <!-- last name --> */}
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className={
                      this.state.validate && this.state.form.lastName === ""
                        ? "form-control require"
                        : "form-control"
                    }
                    id="lname"
                    value={this.state.form.lastName}
                    onChange={ev =>
                      this.setFormData({ lastName: ev.target.value })
                    }
                  ></input>
                </div>
                {/* <!-- Phone --> */}
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="phone"
                    className={
                      this.state.validate && this.state.form.phoneNumber === ""
                        ? "form-control require"
                        : "form-control"
                    }
                    id="phone"
                    value={this.state.form.phoneNumber}
                    onChange={ev =>
                      this.setFormData({ phoneNumber: ev.target.value })
                    }
                  ></input>
                  <small className="form-text text-muted">
                    You will receive a SMS to verify your profile.
                  </small>
                </div>

                <button
                  id="create-account-go"
                  className="btn btn-primary"
                  onClick={this.startCreateAccount}
                >
                  Create
                </button>
                <div
                  id="form-error"
                  className="spartan pt-2"
                  style={{
                    fontSize: "x-small",
                    color: "red",
                    textAlign: "center"
                  }}
                >
                  {this.state.errMsg}
                </div>
              </div>
            )}

            {/* <!-- Text Verification --> */}
            {this.state.showVerification && (
              <div
                id="verify-account"
                className="content spartan"
                style={{
                  lineHeight: "initial",
                  color: "dimgray",
                  position: "relative"
                }}
              >
                {this.state.signInProgress && (
                  <div
                    class="spinner-border text-info"
                    role="status"
                    style={{ position: "absolute", top: "50%", left: "45%" }}
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                )}
                <div
                  id="verify-go-back"
                  className="pb-4"
                  style={{ cursor: "pointer", color: "dodgerblue" }}
                  onClick={() => this.setState({ showVerification: false })}
                >
                  <i className="fas fa-chevron-left"></i>
                  <span className="ml-1">Edit info</span>
                </div>
                <div>
                  A message has been sent to the phone number you provided with
                  a verification code. Please enter it here.
                </div>
                {/* <!-- Verification input --> */}
                <div className="form-group py-2">
                  <label>5-digit verification code</label>
                  <input
                    onChange={ev =>
                      this.setState({ verificationCodeInput: ev.target.value })
                    }
                    type="text"
                    className="form-control"
                    id="v-code"
                  ></input>
                </div>
                <button
                  id="verify-account-go"
                  className="btn btn-success mr-2"
                  onClick={this.verifyCode}
                >
                  Verify
                </button>
                <button
                  id="verify-resend-go"
                  className="btn btn-primary"
                  onClick={this.verifyAccount}
                >
                  Re-send
                </button>
                <div
                  id="verify-form-error"
                  className="spartan pt-2"
                  style={{
                    fontSize: "x-small",
                    color: "red",
                    textAlign: "center"
                  }}
                >
                  {this.state.verifyCodeError}
                </div>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CreateAccount;
