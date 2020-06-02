import React, { Component } from "react";
import ItemView from "./ItemView";
import MyGroupHeader from "./MyGroupHeader";
import MyGroupProfile from "./MyGroupProfile";
import MyGroupBuys from "./MyGroupBuys";
import MyGroupMembers from "./MyGroupMemebers";
import MyGroupNews from "./MyGroupNews";
import { connect } from "react-redux";

/**
 * Roles: How user views are affected my their ROLE level
 *
 * Description: state.userIsMember determines the ROLL.
 *              userIsMember = 0 is Admin priviledges.
 *              userIsMember = 1 is Non-Admin group user. Cannot see admin options.
 *              userIsMember > 1 (2 is not a member, but possible requested to join group).
 *
 *              Currently only using 0, 1, and 2 for ROLES.
 */

const mapStateToProps = (state) => {
  return {
    provisional: state.provisional,
    user: state.user,
    token: state.token,
  };
};

class MyGroupPage extends Component {
  state = {
    modal: null,
    modalUpdate: null,
    joinRequested: false,
    userIsMember: 3,
  };

  componentWillMount() {
    let params = new URLSearchParams(window.location.search);
    let ref = params.get("ref");

    fetchData(this.props.token, this.props.user.id, ref)
      .then((resolved) => {
        console.log(resolved);
        this.setState({ data: resolved });

        // Is User a Clan member?
        let user = resolved.Members.find((obj) => {
          return obj.id === this.props.user.id;
        });
        if (user) {
          this.setState({ userIsMember: user.user_is_admin === 1 ? 0 : 1 });
        } else {
          this.setState({ userIsMember: 2 });
        }

        // Did User request to join Clan?
        let joinRequest = resolved.JoinRequests.find((obj) => {
          if (obj.id === this.props.user.id) {
            this.setState({ joinRequested: true });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  itemView = (deal) => {
    let updateBuy = this.state.data.Purchases.find((obj) => {
      return obj.user_id === this.props.user.id && obj.deal_id === deal.id;
    });
    console.log(updateBuy);
    if (updateBuy) {
      this.setState({ modalUpdate: updateBuy, modal: deal });
    } else {
      this.setState({ modal: deal });
    }
  };

  closeModal = () => {
    this.setState({ modal: null });
  };

  sendJoinRequest = () => {
    joinRequest(this.props.token, this.props.user, this.state.data.Clan[0].id)
      .then((resolved) => {
        console.log(resolved);
        this.setState({ joinRequested: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  memberRequest = (user_id, memberState) => {
    handleMemberRequest(
      this.props.token,
      user_id,
      this.state.data.Clan[0].id,
      memberState
    )
      .then((resolved) => {
        console.log(resolved);
        if (memberState === 1) {
          this.setState((prevState) => {
            let data = { ...prevState.data };
            let requestIndex = data.JoinRequests.findIndex((obj) => {
              return obj.id === user_id;
            });
            let joinRequest = data.JoinRequests.splice(requestIndex, 1);
            joinRequest[0].user_is_admin = 0;
            data.Members.push(joinRequest[0]);
            return { data: data };
          });
        } else if (memberState === 3) {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  makeRevokeAdmin = (user_id, adminValue) => {
    adminToggle(
      this.props.token,
      user_id,
      this.state.data.Clan[0].id,
      adminValue
    )
      .then((resolved) => {
        console.log(resolved);

        this.setState((prevState) => {
          let data = { ...prevState.data };
          let memberIndex = data.Members.findIndex((obj) => {
            return obj.id === user_id;
          });
          data.Members[memberIndex].user_is_admin = adminValue;

          return { data: data };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  removeMember = (user_id) => {
    deleteMember(this.props.token, user_id, this.state.data.Clan[0].id)
      .then((resolved) => {
        console.log(resolved);

        this.setState((prevState) => {
          let data = { ...prevState.data };
          let memberIndex = data.Members.findIndex((obj) => {
            return obj.id === user_id;
          });
          data.Members.splice(memberIndex, 1);
          return { data: data };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateClan = (payload) => {
    updateClanFields(this.props.token, this.state.data.Clan[0].id, payload)
      .then((resolved) => {
        console.log(resolved);

        this.setState((prevState) => {
          let data = { ...prevState.data };
          let keys = Object.keys(payload);
          keys.forEach((k) => {
            data.Clan[0][k] = payload[k];
          });

          return { data: data };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  removeBuy = (dealId) => {
    deleteGroupBuy(this.props.token, this.state.data.Clan[0].id, dealId)
      .then((resolved) => {
        console.log(resolved);
        console.log("BUY ID = ", dealId);
        this.setState((prevState) => {
          let data = { ...prevState.data };
          let buyIndex = data.Buys.findIndex((obj) => {
            return obj.id === dealId;
          });
          console.log(buyIndex);
          data.Buys.splice(buyIndex, 1);
          return { data: data };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addNewNews = (message) => {
    insertNews(this.props.token, this.state.data.Clan[0].id, message)
      .then((resolved) => {
        console.log(resolved);
        this.setState((prevState) => {
          let data = { ...prevState.data };
          data.News.unshift({ message: message });
          return { data: data };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  placeOrder = (deal, purchaseUnits) => {
    let request = {
      userId: this.props.user.id,
      clanId: this.state.data.Clan[0].id,
      dealId: deal.id,
      sellerId: deal.user_id,
      purchaseUnits: purchaseUnits,
      unitPrice: deal.price,
      units: deal.units,
    };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        entity: request,
      }),
    };
    fetch("/accounts/groupPurchase", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.success) {
          // Return to account detail and display error message
          console.log(res);
        } else {
          console.log("Unable to retrieve data");
        }
      });
  };

  updateOrder = (deal, purchaseUnits, Purchase) => {
    let request = {
      purchaseUnits: purchaseUnits,
      unitPrice: deal.price,
      units: deal.units,
      purchase_id: Purchase.id,
    };

    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        entity: request,
      }),
    };

    fetch("/accounts/groupPurchaseUpdate", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.success) {
          console.log(res);
          this.setState((prevState) => {
            let data = { ...prevState.data };
            let target = data.Purchases.find((obj) => {
              return obj.id === Purchase.id;
            });
            if (target) {
              target.purchase_units = purchaseUnits;
            }

            return { data: data };
          });
        } else {
          console.log("Unable to retrieve data");
        }
      });
  };

  render() {
    return (
      <React.Fragment>
        <div
          id="mygroup-page"
          className="row row-border justify-content-center mb-4"
        >
          <div id="main-content" className="col spartan">
            {this.state.modal && (
              <ItemView
                modal={this.state.modal}
                closeModal={this.closeModal}
                // options={GroupPageActions(
                //   this.state.token,
                //   this.state.user.id,
                //   this.state.data.Clan[0].id,
                //   this.state.modal,
                //   this.state.modalUpdate
                // )}
              />
            )}

            <MyGroupHeader
              sendJoinRequest={this.sendJoinRequest}
              joinRequested={this.state.joinRequested}
              data={this.state.data}
              userIsMember={this.state.userIsMember}
              updateClan={this.updateClan}
            />

            <div className="row">
              <div id="mygroup-profile" className="col-sm-12 col-lg-6 d-flex">
                {this.state.data && (
                  <MyGroupProfile
                    data={this.state.data}
                    userIsMember={this.state.userIsMember}
                    updateClan={this.updateClan}
                  />
                )}
              </div>

              <div id="mygroup-buys" className="col-sm-12 col-lg-6 d-flex">
                <MyGroupBuys
                  itemView={this.itemView}
                  data={this.state.data}
                  removeBuy={this.removeBuy}
                  userIsMember={this.state.userIsMember}
                  placeOrder={this.placeOrder}
                  updateOrder={this.updateOrder}
                  userId={this.props.user.id}
                />
              </div>
            </div>
            <div className="row mt-4">
              <div id="members-card" className="col-sm-12 col-lg-6 d-flex">
                <MyGroupMembers
                  data={this.state.data}
                  memberRequest={this.memberRequest}
                  userIsMember={this.state.userIsMember}
                  makeRevokeAdmin={this.makeRevokeAdmin}
                  removeMember={this.removeMember}
                />
              </div>
              <div id="news-card" className="col-sm-12 col-lg-6 d-flex">
                <MyGroupNews
                  addNewNews={this.addNewNews}
                  data={this.state.data}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(MyGroupPage);

function fetchData(token, userid, ref) {
  console.log("fetching data......", token, userid);
  return new Promise((resolve, reject) => {
    let request = { userId: userid, clanId: ref };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        entity: request,
      }),
    };
    fetch("/accounts/clanView", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (!res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject("Unable to retrieve data");
        }
      });
  });
}

function joinRequest(token, user, clanId) {
  console.log("fetching data......");
  return new Promise((resolve, reject) => {
    let request = { user: user, clanId: clanId };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        entity: request,
      }),
    };
    fetch("/accounts/joinClanRequest", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject("Unable to retrieve data");
        }
      });
  });
}

function handleMemberRequest(token, user, clanId, memberState) {
  return new Promise((resolve, reject) => {
    let request = { user: user, clanId: clanId, memberState: memberState };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        entity: request,
      }),
    };
    fetch("/accounts/addUserToGroup", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject("Unable to retrieve data");
        }
      });
  });
}

function adminToggle(token, user, clanId, adminValue) {
  return new Promise((resolve, reject) => {
    let request = { user: user, clanId: clanId, adminValue: adminValue };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        entity: request,
      }),
    };
    fetch("/accounts/adminToggle", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject("Unable to retrieve data");
        }
      });
  });
}

function deleteMember(token, user, clanId) {
  return new Promise((resolve, reject) => {
    let request = { user: user, clanId: clanId };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        entity: request,
      }),
    };
    fetch("/accounts/deleteMember", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject("Unable to retrieve data");
        }
      });
  });
}

function updateClanFields(token, clanId, payload) {
  return new Promise((resolve, reject) => {
    let request = { values: payload, clanId: clanId };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        entity: request,
      }),
    };
    fetch("/accounts/updateClanFields", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject("Unable to retrieve data");
        }
      });
  });
}

function deleteGroupBuy(token, clanId, dealId) {
  return new Promise((resolve, reject) => {
    let request = { clanId: clanId, dealId: dealId };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        entity: request,
      }),
    };
    fetch("/accounts/deleteGroupBuy", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject("Unable to retrieve data");
        }
      });
  });
}

function insertNews(token, clanId, message) {
  return new Promise((resolve, reject) => {
    let request = { clanId: clanId, message: message };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        entity: request,
      }),
    };
    fetch("/accounts/insertNews", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject("Unable to retrieve data");
        }
      });
  });
}
