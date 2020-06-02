import React, { Component } from 'react';

class MyGroupOrders extends Component {
  state = {};

  displayPurchases = () => {
    let buy = this.props.Buy;
    let purchases = [];
    this.props.data.Purchases.forEach((p, index) => {
      if (p.deal_id === buy.id) {
        let newP = {};
        newP.purchase_units = p.purchase_units;
        newP.purchase_total = p.purchase_total;

        // User
        let user = this.props.data.Members.find(obj => {
          return obj.id === p.user_id;
        });
        newP.user = user;

        purchases.push(newP);
      }
    });

    console.log(purchases);
    return purchases;
  };

  render() {
    return (
      <div className="card bg-light">
        <div className="card-header d-flex align-items-center">
          <i
            className="fas fa-chevron-left mr-3"
            onClick={() => this.props.seeOrder(null)}
          ></i>
          <img
            className="seller-img"
            src={"./Uploads/Deal_Images/" + this.props.Buy.image_url}
            alt=""
          />
          <div>{this.props.Buy.description}</div>
        </div>
        <div className="card-body p-0" style={{ overflowY: "auto" }}>
          <div className="container-fluid" id="group-list">
            <ul
              id="group-buys-list"
              style={{ listStyle: "none", padding: "0", fontSize: "small" }}
            >
              {this.displayPurchases().map((b, index) => {
                return (
                  <li
                    key={index}
                    className="row group-buy-item"
                    // onClick={() => this.props.itemView(b)}
                  >
                    {/* User image */}
                    <div className="col-6">
                      <img
                        className="seller-img"
                        src={"./Uploads/Profile_Images/" + b.user.image_url}
                        alt=""
                      />
                      <span style={{ color: "dimgray" }}>
                        {b.user.first_name + " " + b.user.last_name}
                      </span>
                    </div>
                    {/* Item info */}
                    <div className="col-6" style={{ color: "#28a745" }}>
                      Units: {b.purchase_units}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default MyGroupOrders;