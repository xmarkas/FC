import React, { Component } from "react";
import { Link } from "react-router-dom";
import { CatalogActions } from "./ItemViewOption";

class Buys extends Component {
  state = {
    tab: 1,
  };

  render() {
    return (
      <React.Fragment>
        <div
          className="card"
          style={{
            height: "auto",
            maxHeight: "initial",
          }}
        >
          <div
            className="card-header"
            style={{
              backgroundColor: "white",
              padding: ".75rem 1.25rem 0 .75rem",
              display: "flex",
            }}
          >
            <div
              style={{ cursor: "pointer" }}
              onClick={() => this.setState({ tab: 1 })}
              className={
                this.state.tab === 1 ? "profile-tabs-selected" : "profile-tabs"
              }
            >
              My Orders
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => this.setState({ tab: 2 })}
              className={
                this.state.tab === 2 ? "profile-tabs-selected" : "profile-tabs"
              }
            >
              My Offers
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => this.setState({ tab: 3 })}
              className={
                this.state.tab === 3 ? "profile-tabs-selected" : "profile-tabs"
              }
            >
              Wish List
            </div>
            {/* TAB 1 - catalog button */}
            {this.state.tab === 1 && (
              <Link
                to="/catalog"
                className="btn btn-sm btn-primary"
                style={{
                  font: "small-caption",
                  position: "absolute",
                  right: "10px",
                }}
              >
                catalog
              </Link>
            )}
            {/* TAB 2 - add button */}
            {this.state.tab === 2 && (
              <button
                className="btn btn-sm btn-primary"
                style={{
                  font: "small-caption",
                  position: "absolute",
                  right: "10px",
                }}
                onClick={this.props.showAddDeal}
              >
                <i className="fas fa-plus"></i>
              </button>
            )}
          </div>
          <div
            className="card-body py-2 px-2"
            style={{
              maxHeight: "450px",
              overflowY: "auto",
              overflowX: "hidden",
              backgroundColor: "#f5f5f5",
            }}
          >
            <ul
              id="buys-list"
              style={{
                fontSize: "x-small",
                listStyle: "none",
                paddingInlineStart: "0",
              }}
            >
              {this.state.tab === 1 &&
                this.props.data &&
                !this.props.data.Purchases.length && (
                  <div>No items to display</div>
                )}
              {/* PURCHASE LIST */}
              {this.props.data &&
                this.state.tab === 1 &&
                this.props.data.Purchases.map((buy, index) => {
                  return buyItem(buy, index, this);
                })}

              {/* DEAL LIST */}
              {this.props.data &&
                this.state.tab === 2 &&
                this.props.data.Deals.map((deal, index) => {
                  return buyItem(deal, index, this);
                })}

              {/* WISH LIST */}
              {this.props.data &&
                this.state.tab === 3 &&
                this.props.data.Buys.map((buy, index) => {
                  return buyItem(buy, index, this);
                })}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function buyItem(item, index, thisContext) {
  let stars = (score) => {
    let scoreArr = [];
    for (let s = 0; s < 5; s++) {
      if (s < score) {
        scoreArr.push(<i key={s} className="fas fa-star sY"></i>);
      } else {
        scoreArr.push(<i key={s} className="fas fa-star sG"></i>);
      }
    }
    return scoreArr;
  };

  return (
    <li
      key={index}
      className="item-list-wrap my-2"
      style={{
        backgroundColor: index % 2 === 0 ? "white" : "white",
        cursor: thisContext.state.tab === 2 ? "pointer" : "initial",
      }}
    >
      <div
        className="row"
        style={{
          textDecoration: "none",
          color: "dimgray",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "15px",
            color: "lightgrey",
            display: "none",
            fontSize: "1rem",
          }}
          className="fas fa-pencil-alt fa-1x"
        ></div>
        <div className="col-6 col-md-3 mb-2 mb-md-0">
          {item.image_url && (
            <img
              src={"/Deal_Images/" + item.image_url}
              alt=""
              style={{ maxHeight: "100px", borderRadius: "5px" }}
            ></img>
          )}
          {!item.image_url && (
            <img
              src="/media/no_image.png"
              alt=""
              style={{ maxHeight: "100px" }}
            ></img>
          )}
        </div>
        <div className="col-6 col-md-3">
          <div className="item-description">{item.description}</div>
          <div className="item-info my-2">
            {item.units} {item.unit_measure} for ${item.price}
          </div>
          {item.seller_name && (
            <div className="item-seller mt-3">
              <img
                className="seller-img"
                src={"/Profile_Images/" + item.seller_image}
                alt=""
              ></img>
              <div className="seller-name">
                <div>{item.seller_name}</div>
                <div className="stars justify-content-center">
                  {stars(item.score)}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-sm-5 col-md-6" style={{ display: "grid" }}>
          {item.summary}
          <div
            className="row"
            style={{ alignSelf: "flex-end", justifySelf: "flex-end" }}
          >
            {/* options for My Offers */}
            {thisContext.state.tab === 2 && !thisContext.state.removeDeal && (
              <div className="col d-flex">
                {/* add to */}
                {CatalogActions(
                  thisContext.props.token,
                  thisContext.props.data.MyClans,
                  thisContext.props.user.id,
                  item
                )}
                {/* remove deal */}
                <button
                  className="btn btn-sm btn-danger mr-2"
                  style={{ fontSize: "inherit", fontWeight: "600" }}
                  onClick={() => thisContext.setState({ removeDeal: true })}
                >
                  remove
                </button>
                {/* edit deal */}
                <button
                  className="btn btn-sm btn-primary"
                  style={{ fontSize: "inherit", fontWeight: "600" }}
                  onClick={() => thisContext.props.editDeal(index)}
                >
                  edit
                </button>
              </div>
            )}
            {thisContext.state.tab === 2 && thisContext.state.removeDeal && (
              <div className="col d-flex align-items-center">
                <span className="mr-1">Are you sure you want to remove this offer?</span>
                <button
                  className="btn btn-sm btn-success mr-2"
                  style={{ fontSize: "inherit", fontWeight: "600" }}
                  onClick={() => thisContext.props.removeDeal(item.id)}
                >
                  confirm
                </button>
                <button
                  className="btn btn-sm btn-danger mr-2"
                  style={{ fontSize: "inherit", fontWeight: "600" }}
                  onClick={() => thisContext.setState({ removeDeal: false })}
                >
                  cancel
                </button>
              </div>
            )}
            {/* Options for wish list */}
            {thisContext.state.tab === 3 && (
              <div className="col">
                {/* remove from wish list */}
                <button
                  className="btn btn-sm btn-danger mr-2"
                  style={{ fontSize: "inherit", fontWeight: "600" }}
                  onClick={() => thisContext.props.removeFromWishList(item.id)}
                >
                  remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default Buys;
