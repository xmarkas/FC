import React, { Component } from 'react';

class MyGroupHeader extends Component {
  state = {
    edit: false,
    summary: "_"
  }

  editHeader = () => {
    this.setState({ edit: this.state.edit ? false : true });
  };

  render() {
    return (
      <div
        className="row my-4 mx-0"
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
          padding: "10px"
        }}
      >
        <div className="col-9">
          <h4>
            About Our Group{" "}
            {this.props.userIsMember < 1 && (
              <i
                onClick={this.editHeader}
                style={{ fontSize: "medium", cursor: "pointer" }}
                className="fas fa-pencil-alt"
              ></i>
            )}
            {this.state.edit && (
              <button
                style={{ fontSize: "small" }}
                className="btn btn-sm btn-success ml-2"
                onClick={() => {
                  this.setState({ edit: false });
                  this.props.updateClan({ summary: this.state.summary })
                }
                }
              >
                save
              </button>
            )}
          </h4>
          <div style={{ fontSize: ".8rem", fontStyle: "italic" }}>
            {!this.state.edit &&
              this.props.data &&
              this.props.data.Clan[0].summary}
            {this.state.edit && (
              <textarea
                onChange={ev => {
                  this.setState({ summary: ev.target.value });
                }}
                style={{ width: "100%", borderRadius: "5px" }}
                value={ this.state.summary === "_" ? this.props.data.Clan[0].summary: this.state.summary}
              ></textarea>
            )}
          </div>
        </div>
        <div className="col-3 d-flex justify-content-center align-items-center">
          {this.props.userIsMember > 1 && !this.props.joinRequested && (
            <button
              className="btn btn-sm btn-primary"
              onClick={this.props.sendJoinRequest}
            >
              Send join request
            </button>
          )}
          {this.props.userIsMember > 1 && this.props.joinRequested && (
            <div className="sent-request">Request Sent!</div>
          )}
          {/* {this.props.data && this.props.userIsMember < 2 && (
            <button
              className="btn btn-sm"
              onClick={this.props.leaveGroup}
              style={{ backgroundColor: "#343a40", color: "white" }}
            >
              Leave group
            </button>
          )} */}
        </div>
      </div>
    );
  }
}

export default MyGroupHeader;