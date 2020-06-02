import React, { Component } from 'react';

class MyGroupMembers extends Component {
  state = {
    showMemberOptions: null
  };

  showMemberOptions = index => {
    this.setState({
      showMemberOptions: this.state.showMemberOptions === index ? null : index
    });
  };


  render() {
    return (
      <div className="card bg-light">
        <div
          className="card-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div className="mr-4">
            Members {this.props.data && this.props.data.Members.length}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {this.props.data &&
              !this.props.userIsMember &&
              this.props.data.JoinRequests.length > 0 && (
                <div className="alert-tag">New Request</div>
              )}
          </div>
        </div>
        <div className="card-body p-0" style={{ overflowY: "auto" }}>
          <div className="container-fluid" id="group-list">
            <ul
              id="group-buys-list"
              style={{ listStyle: "none", padding: "0", fontSize: "small" }}
            >
              {/* Member Requests */}
              {this.props.data &&
                !this.props.userIsMember &&
                this.props.data.JoinRequests.map((m, index) => {
                  return (
                    <li
                      key={index}
                      className="row group-buy-item member-request"
                      style={{ backgroundColor: "#e9ecef", color: "dimgray" }}
                    >
                      <div className="col-6">{m.first_name}</div>
                      <div
                        className="col-6"
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <button
                          className="btn btn-sm"
                          style={{ fontSize: "large", color: "#28a745" }}
                        >
                          <i
                            className="fas fa-check-square approve-deny"
                            onClick={() => this.props.memberRequest(m.id, 1)}
                          ></i>
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ fontSize: "large", color: "#dc3545" }}
                        >
                          <i
                            className="fas fa-times-circle approve-deny"
                            onClick={() => this.props.memberRequest(m.id, 3)}
                          ></i>
                        </button>
                      </div>
                    </li>
                  );
                })}
              {/* Members */}
              {this.props.data &&
                this.props.data.Members.map((m, index) => {
                  return (
                    <React.Fragment key={index}>
                      <li
                        onClick={() => this.showMemberOptions(index)}
                        className="row group-buy-item"
                        style={{ backgroundColor: setColor(index) }}
                      >
                        <div className="col-6">{m.first_name}</div>
                        <div
                          className="col-6"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end"
                          }}
                        >
                          <div>
                            {m.id === this.props.data.Clan[0].admin_id && (
                              <i className="fas fa-shield-alt mr-1"></i>
                            )}
                            {m.user_is_admin === 1 && (
                              <i className="fas fa-shield-alt mr-3"></i>
                            )}
                            {this.props.userIsMember === 0 &&
                              <i
                                className="fas fa-pencil-alt"
                                onClick={() => this.showMemberOptions(index)}
                              ></i>}
                          </div>
                        </div>
                      </li>
                      {this.props.userIsMember === 0 && m.id !== this.props.data.Clan[0].admin_id && (
                        <div
                          className={
                            index === this.state.showMemberOptions
                              ? "row member-actions ma-show"
                              : "row member-actions"
                          }
                          style={{
                            backgroundColor: setColor(index),
                            fontSize: "small"
                          }}
                        >
                          {!m.user_is_admin && (
                            <button
                              className="btn btn-sm btn-dark"
                              onClick={() => {
                                this.props.makeRevokeAdmin(m.id, 1);
                                this.showMemberOptions(index);
                              }}
                            >
                              Make Admin
                            </button>
                          )}
                          {m.user_is_admin === 1 && (
                            <button
                              className="btn btn-sm btn-dark"
                              onClick={() => {
                                this.props.makeRevokeAdmin(m.id, 0);
                                this.showMemberOptions(index);
                              }}
                            >
                              Revoke Admin
                            </button>
                          )}
                          <button className="btn btn-sm btn-dark" onClick={() => this.props.removeMember(m.id)}>
                            Remove Member
                          </button>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default MyGroupMembers;

function setColor(index) {
  if (index % 4 === 0) {
    return "#17a2b8";
  } else if (index % 3 === 0) {
    return "#ffc107";
  } else if (index % 2 === 0) {
    return "#28a745";
  } else {
    return "#dc3545";
  }
}
