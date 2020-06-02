import React, { Component } from "react";
import { connect } from "react-redux";
import AddDeal from "./AddDeal";
import Profile from "./Profile";
import Buys from "./Buys";
import Deals from "./Deals";
import MyGroups from "./MyGroups";

const mapStateToProps = state => {
  return {
    user: state.user,
    token: state.token
  };
};

class DashboardView extends Component {
  state = {
    // token: null,
    // user: null,
    data: null,
    showAddDeal: false,
    editDeal: null
  };

  componentWillMount() {
    fetchData(this.props.token, this.props.user.id)
      .then(resolved => {
        console.log(resolved);
        this.setState({ data: resolved });
      })
      .catch(err => {
        console.log(err);
      });
  }

  newDeal = payload => {
    insertDeal(this.props.token, this.props.user.id, payload)
      .then(resolved => {
        console.log(resolved);
        this.setState(
          prevState => {
            let Deals = [...prevState.data.Deals];

            Deals.push(payload);
            let data = { ...prevState.data, Deals: Deals };
            return { data: data };
          },
          () => {
            this.setState({ showAddDeal: false });
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  updateDeal = payload => {
    updateDealEdit(this.props.token, this.props.user.id, payload)
      .then(resolved => {
        console.log(resolved);
        this.setState(
          prevState => {
            let Deals = [...prevState.data.Deals];
            let deal = Deals.findIndex(obj => {
              return obj.id === payload.id;
            });
            Deals[deal] = payload;

            let data = { ...prevState.data, Deals: Deals };
            return { data: data };
          },
          () => {
            this.setState({ showAddDeal: false });
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  removeDeal = payload => {
    removeDealDB(this.props.token, this.props.user.id, payload)
      .then(resolved => {
        console.log(resolved);
        this.setState(
          prevState => {
            let Deals = [...prevState.data.Deals];
            let deal = Deals.findIndex(obj => {
              return obj.id === payload;
            });
            Deals.splice(deal, 1);

            let data = { ...prevState.data, Deals: Deals };
            return { data: data };
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  showAddDeal = toggle => {
    this.setState({
      showAddDeal: this.state.showAddDeal ? false : true,
      editDeal: null
    });
  };

  editDeal = index => {
    this.setState({
      editDeal: this.state.data.Deals[index],
      showAddDeal: true
    });
  };

  updateProfile = payload => {
    updateUserProfile(this.props.token, this.props.user.id, payload)
      .then(resolved => {
        console.log(resolved);
        this.setState(prevState => {
          let user = { ...prevState.user };
          let keys = Object.keys(payload);
          keys.forEach(k => {
            user[k] = payload[k];
          });

          return { user: user };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  leaveGroup = (clanId) => {
    removeUserFromGroup(
      this.props.token,
      this.props.user,
      clanId
    )
      .then(resolved => {
        console.log(resolved);
        this.setState((prevState) => {
          let clans = [...prevState.data.MyClans];
          let clanIndex = clans.findIndex(obj => obj.id === clanId);
          clans.splice(clanIndex, 1);
          let data = { ...prevState.data, MyClans: clans };
          return { data: data };
        })
      })
      .catch(err => {
        console.log(err);
      });
  };

  removeFromWishList = (itemId) => {
    console.log("wish list nix");
    removeItemFromWishList(
      this.props.token,
      this.props.user,
      itemId
    )
      .then(resolved => {
        console.log(resolved);
        this.setState((prevState) => {
          let buys = [...prevState.data.Buys];
          let itemIndex = buys.findIndex(obj => obj.id === itemId);
          buys.splice(itemIndex, 1);
          let data = { ...prevState.data, Buys: buys };
          return { data: data };
        })
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <React.Fragment>
        {/* Dashboard */}
        <div id="dashboard" className="row row-border justify-content-center">
          {/* Add Deal */}
          {this.state.showAddDeal && (
            <AddDeal
              editDeal={this.state.editDeal}
              showAddDeal={this.showAddDeal}
              user={this.props.user}
              newDeal={this.newDeal}
              updateDeal={this.updateDeal}
            />
          )}
          <div id="main-content" className="col-sm-12 col-md-10 spartan py-4">
            <div className="row">
              <div id="profile-card" className="col-sm-12 col-lg-6 d-flex">
                {/* <!-- PROFILE --> */}

                <Profile updateProfile={this.updateProfile} />
              </div>

              <div id="groups-card" className="col-sm-12 col-lg-6 d-flex">
                {/* <!-- GROUPS --> */}
                <MyGroups data={this.state.data} leaveGroup={this.leaveGroup} />
              </div>
            </div>
            <div className="row mt-4">
              <div id="buys-card" className="col-12">
                {/* <!-- BUYS --> */}
                <Buys
                  data={this.state.data}
                  showAddDeal={this.showAddDeal}
                  editDeal={this.editDeal}
                  removeDeal={this.removeDeal}
                  user={this.props.user}
                  token={this.props.token}
                  removeFromWishList={this.removeFromWishList}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(DashboardView);

function fetchData(token, userid) {
  console.log("fetching data......", token, userid);
  return new Promise((resolve, reject) => {
    let request = { userId: userid };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        entity: request
      })
    };
    fetch("/accounts/dashboard", options)
      .then(res => {
        if (res) return res.json();
      })
      .then(res => {
        if (!res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject("Unable to retrieve data");
        }
      });
  });
}

function insertDeal(token, userid, payload) {
  console.log("fetching data......", token, userid);
  payload.user_id = userid; // Append user_id to payload
  return new Promise((resolve, reject) => {
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        entity: payload
      })
    };
    fetch("/accounts/insertDeal", options)
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject(res);
        }
      });
  });
}

function updateDealEdit(token, userid, payload) {
  console.log("fetching data......", token, userid);
  payload.user_id = userid; // Append user_id to payload
  return new Promise((resolve, reject) => {
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        entity: payload
      })
    };
    fetch("/accounts/updateDeal", options)
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject(res);
        }
      });
  });
}

function removeDealDB(token, userid, payload) {
  return new Promise((resolve, reject) => {
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        entity: { dealId: payload }
      })
    };
    fetch("/accounts/removeDealDB", options)
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject(res);
        }
      });
  });
}

function updateUserProfile(token, userid, payload) {
  let payloadObj = { userId: userid, values: payload };
  console.log("fetching data......", token, userid);
  return new Promise((resolve, reject) => {
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        entity: payloadObj
      })
    };
    fetch("/accounts/updateUserProfile", options)
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject(res);
        }
      });
  });
}

function removeUserFromGroup(token, user, clanId) {
  console.log("fetching data......");
  return new Promise((resolve, reject) => {
    let request = { user: user, clanId: clanId };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        entity: request
      })
    };
    fetch("/accounts/removeUserFromClan", options)
      .then(res => {
        return res.json();
      })
      .then(res => {
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

function removeItemFromWishList(token, user, itemId) {
  console.log("fetching data......");
  return new Promise((resolve, reject) => {
    let request = { user: user, itemId: itemId };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        entity: request
      })
    };
    fetch("/accounts/deleteWishListBuy", options)
      .then(res => {
        return res.json();
      })
      .then(res => {
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