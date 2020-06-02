import React, { Component } from "react";
import NavMenu from "./NavMenu";
import UserStatus from "./UserStatus";
import SignIn from "./SignIn";
import CreateAccount from "./CreateAccount";

class NavView extends Component {
  state = {
    signInToggle: false,
    createAccountToggle: false,
  };

  updateParentState = (obj) => {
    this.setState(obj);
  };

  createAccount = (toggle) => {
    console.log("toggle");
    this.setState({
      createAccountToggle: this.state.createAccountToggle ? false : true,
    });
  };

  render() {
    return (
      // <!-- Navigation -->
      <React.Fragment>
        {/* <!-- OKTA SDK --> */}
        {/* <script src="./js/okta-auth-js.min.js"></script> */}
        <div className="row" style={{ backgroundColor: "white" }}>
          <div className="col">
            <NavMenu />
          </div>
          <div
            className="col-12 col-sm d-flex align-items-center py-1 justify-content-center justify-content-md-end"
            style={{ justifyContent: "flex-end" }}
          >
            <UserStatus
              updateParentState={this.updateParentState}
              createAccount={this.createAccount}
            />
          </div>

          {this.state.createAccountToggle && (
            <CreateAccount createAccount={this.createAccount} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default NavView;
