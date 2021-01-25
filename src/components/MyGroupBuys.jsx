import React, { Component } from "react";
import MyGroupOrders from "./MyGroupOrders";
import { Link } from "react-router-dom";

class MyGroupBuys extends Component {
  state = {
    menuIndex: null,
    removeCheck: null,
    viewOrder: null,
    showBuyOptions: null,
    buyQuantity: 0,
    spinner: false,
  };

  totalUnitsPurchased = (dealId) => {
    let units = 0;
    this.props.data.Purchases.forEach((p) => {
      if (p.deal_id === dealId) {
        units += p.purchase_units;
      }
    });

    return units;
  };

  seeOrder = (order) => {
    this.setState({ viewOrder: order });
  };

  showBuyOptions = (index, buy) => {
    let order = this.props.data.Purchases.find((obj) => {
      return obj.deal_id === buy.id && obj.user_id === this.props.userId;
    });

    this.setState({
      showBuyOptions: this.state.showBuyOptions === index ? null : index,
      buyQuantity: order ? order.purchase_units : 0,
    });
  };

  userHasOrder = (userId, dealId) => {
    // Look for existing order
    let order = this.props.data.Purchases.find((obj) => {
      return obj.deal_id === dealId && obj.user_id === userId;
    });
    return order ? order : false;
  };

  closeOptions = () => {
    setTimeout(() => {
      this.setState({
        showBuyOptions: null,
        menuIndex: null,
        spinner: false,
        removeCheck: null,
      });
    }, 1500);
  };

  render() {
    return (
      <React.Fragment>
        {this.state.viewOrder && (
          <MyGroupOrders
            data={this.props.data}
            Buy={this.state.viewOrder}
            seeOrder={this.seeOrder}
          />
        )}
        {!this.state.viewOrder && (
          <div className="card bg-light">
            <div className="card-header button-group">
              <div>Our Buys - Place Your Order Now!</div>
              <Link
                to="/catalog"
                className="btn btn-sm btn-primary"
                style={{
                  font: "small-caption",
                  float: "right",
                  height: "fit-content",
                }}
              >
                catalog
              </Link>
            </div>
            <div className="card-body p-0" style={{ overflowY: "auto" }}>
              <div className="container-fluid" id="group-list">
                <ul
                  id="group-buys-list"
                  style={{ listStyle: "none", padding: "0", fontSize: "small" }}
                >
                  {this.props.data &&
                    this.props.data.Buys.map((b, index) => {
                      return (
                        <React.Fragment>
                          <li
                            key={index}
                            className="row group-buy-item"
                            style={{
                              boxShadow:
                                this.state.showBuyOptions === index
                                  ? "0px 4px 6px 1px rgba(0, 0, 0, 0.2)"
                                  : "none",
                            }}
                            onClick={() => this.showBuyOptions(index, b)}
                          >
                            {/* Item image */}
                            <div className="col-2">
                              <img
                                className="seller-img"
                                src={"/Deal_Images/" + b.image_url}
                                alt=""
                              />
                            </div>
                            {/* Item info */}
                            <div
                              className="col-10"
                              style={{ color: "dimgray" }}
                            >
                              <span className="item-emph">{b.description}</span>
                            </div>

                            {this.props.userIsMember == 0 && (
                              <div
                                style={{ position: "absolute", right: "5px" }}
                                className="buy-ellips d-flex align-items-center"
                              >
                                <div
                                  className="buy-ellips-menu"
                                  style={
                                    this.state.menuIndex === index
                                      ? { width: "295px" }
                                      : { width: "0" }
                                  }
                                >
                                  {/* Remove */}
                                  {/* step 1 */}
                                  {this.state.removeCheck !== index && (
                                    <button
                                      className="btn btn-sm btn-danger m-2"
                                      style={{ fontSize: ".7rem" }}
                                      onClick={(ev) => {
                                        ev.stopPropagation();
                                        this.setState({ removeCheck: index });
                                      }}
                                    >
                                      Remove
                                    </button>
                                  )}
                                  {/* step 2 */}
                                  {this.state.removeCheck === index && (
                                    <React.Fragment>
                                      <span style={{ fontSize: ".7rem" }}>
                                        Are you sure?
                                      </span>
                                      <button
                                        className="btn btn-sm btn-danger m-2"
                                        style={{ fontSize: ".7rem" }}
                                        onClick={(ev) => {
                                          ev.stopPropagation();
                                          this.props.removeBuy(b.id);
                                        }}
                                      >
                                        Remove
                                      </button>
                                      <button
                                        className="btn btn-sm btn-secondary m-2"
                                        style={{ fontSize: ".7rem" }}
                                        onClick={(ev) => {
                                          ev.stopPropagation();
                                          this.setState({ removeCheck: null });
                                        }}
                                      >
                                        Keep Offer
                                      </button>
                                    </React.Fragment>
                                  )}

                                  {this.state.removeCheck !== index && (
                                    <button
                                      className="btn btn-sm btn-primary m-2"
                                      style={{
                                        fontSize: ".7rem",
                                        whiteSpace: "nowrap",
                                      }}
                                      onClick={(ev) => {
                                        ev.stopPropagation();
                                        this.seeOrder(b);
                                      }}
                                    >
                                      View Orders
                                    </button>
                                  )}
                                </div>

                                <i
                                  style={{
                                    width: "20px",
                                    textAlign: "center",
                                    marginLeft: "5px",
                                    color:
                                      this.state.menuIndex === index
                                        ? "red"
                                        : "gray",
                                  }}
                                  className={
                                    this.state.menuIndex === index
                                      ? "far fa-times-circle"
                                      : "fas fa-ellipsis-v"
                                  }
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    console.log(index, this.state.menuIndex);
                                    this.setState({
                                      menuIndex:
                                        index === this.state.menuIndex
                                          ? null
                                          : index,
                                      removeCheck: null,
                                    });
                                  }}
                                ></i>
                              </div>
                            )}
                          </li>

                          {/* Buy Options */}
                          <div
                            className={
                              index === this.state.showBuyOptions
                                ? "buy-options bo-show"
                                : "buy-options"
                            }
                          >
                            <div className="row justify-content-center align-items-center">
                              <div
                                className="col-8"
                                style={{
                                  fontSize: "x-small",
                                  fontWeight: "700",
                                }}
                              >
                                <div>{b.summary}</div>
                                <div>
                                  Deal: {b.units} {b.unit_measure} for $
                                  {b.price}
                                </div>
                              </div>
                              <div
                                className="col-4"
                                style={{
                                  fontSize: "x-small",
                                  fontWeight: "700",
                                }}
                              >
                                <div className="text-right">
                                  Group orders {this.totalUnitsPurchased(b.id)}/
                                  {b.units}
                                  {b.unit_measure}
                                </div>
                              </div>
                            </div>
                            <div className="row justify-content-center align-items-center my-2">
                              <div
                                className="col-4"
                                style={{ justifyContent: "space-between" }}
                              >
                                <div className="text-center">
                                  <span
                                    className="buy-cost"
                                    style={{ fontSize: ".7rem" }}
                                  >
                                    Total $
                                    {(
                                      (b.price / b.units) *
                                      this.state.buyQuantity
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <div className="col-4 text-center">
                                <span style={{ fontSize: ".7rem" }}>
                                  Order in {b.unit_measure}
                                </span>
                                <input
                                  className="ml-2"
                                  style={{
                                    borderStyle: "none",
                                    borderRadius: "3px",
                                    width: "50px",
                                    textAlign: "center",
                                  }}
                                  value={this.state.buyQuantity}
                                  type="number"
                                  onChange={(ev) =>
                                    this.setState({
                                      buyQuantity: ev.target.value,
                                    })
                                  }
                                ></input>
                              </div>
                              <div className="col-4">
                                <div className="text-right">
                                  <button
                                    style={{ fontSize: "x-small" }}
                                    className="btn btn-sm btn-primary mr-1"
                                    onClick={() =>
                                      this.setState({
                                        buyQuantity: this.state.buyQuantity + 1,
                                      })
                                    }
                                  >
                                    <i className="fas fa-plus"></i>
                                  </button>
                                  <button
                                    style={{ fontSize: "x-small" }}
                                    className="btn btn-sm btn-primary"
                                    onClick={() =>
                                      this.setState({
                                        buyQuantity:
                                          this.state.buyQuantity > 0
                                            ? this.state.buyQuantity - 1
                                            : 0,
                                      })
                                    }
                                  >
                                    <i className="fas fa-minus"></i>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="row justify-content-center">
                              <div className="col text-center">
                                {this.userHasOrder(this.props.userId, b.id) ===
                                false ? (
                                  <button
                                    style={{ fontSize: ".7rem" }}
                                    className="btn btn-sm btn-success"
                                    onClick={() => {
                                      this.props.placeOrder(
                                        b,
                                        this.state.buyQuantity
                                      );
                                      this.setState({ spinner: true });
                                      this.closeOptions();
                                    }}
                                  >
                                    Commit
                                    {/* Spinner */}
                                    {this.state.spinner && (
                                      <div
                                        class="spinner-border text-info"
                                        role="status"
                                        style={{
                                          position: "absolute",
                                          top: "50%",
                                          left: "45%",
                                        }}
                                      >
                                        <span class="sr-only">Loading...</span>
                                      </div>
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    style={{ fontSize: ".7rem" }}
                                    className="btn btn-sm btn-success"
                                    onClick={() => {
                                      this.props.updateOrder(
                                        b,
                                        this.state.buyQuantity,
                                        this.userHasOrder(
                                          this.props.userId,
                                          b.id
                                        )
                                      );
                                      this.setState({ spinner: true });
                                      this.closeOptions();
                                    }}
                                  >
                                    Update
                                    {/* Spinner */}
                                    {this.state.spinner && (
                                      <div
                                        class="spinner-border text-info"
                                        role="status"
                                        style={{
                                          position: "absolute",
                                          top: "50%",
                                          left: "45%",
                                        }}
                                      >
                                        <span class="sr-only">Loading...</span>
                                      </div>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default MyGroupBuys;
