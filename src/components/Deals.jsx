import React, { Component } from 'react';
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

class Deals extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <div className="card bg-light" style={{maxHeight: "50vh"}}>
          <div className="card-header text-center">
            Your Deals
            <button
              className="btn btn-sm btn-primary"
              style={{ font: "small-caption", float: "right" }}
              onClick={this.props.showAddDeal}
            >
             <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="card-body py-1 px-2">
            <div
              className="py-2"
              id="buys-list"
              style={{ fontSize: "x-small", display: "flex", overflowY: "auto"}}
            >
              {/* BUY LIST */}
              {this.props.data &&
                this.props.data.Deals.map((deal, index) => {
                  return CatalogItem(deal, index, this.props.user, this);
                })}
              {!this.props.data && <div>No items to display</div>}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(Deals);

function CatalogItem(item, index, user, thisContext) {
  let stars = score => {
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
      <div
          onClick={() => thisContext.props.editDeal(index)}
      key={index}
      className="catalog-item mx-2"
      style={{ minWidth: "175px", position: "relative", cursor: "pointer" }}
    >
      <div className="item-header">
        <div
          style={{
            position: "absolute",
            right: "10px",
            top: "10px",
            color: "lightgrey",
            display: "none",
            fontSize: "1rem"
          }}
          className="fas fa-pencil-alt fa-1x"
        ></div>
        {item.image_url && (
          <img
            src={"/Uploads/Deal_Images/" + item.image_url}
            alt=""
          ></img>
        )}
        {!item.image_url && (
          <img src="/media/no_image.png" alt="" style={{alignSelf: "flex-end"}}></img>
        )}
      </div>
      <div className="item-info-group">
        <div className="item-description">{item.description}</div>
        <div className="item-info">
          {item.units} {item.unit_measure} for ${item.price}
        </div>
        <div className="item-seller">
          {user.image_url && (
            <img
              className="seller-img"
              src={"/Uploads/Profile_Images/" + user.image_url}
              alt=""
            ></img>
          )}
          {!user.image_url && (
            <i className="fas fa-user-circle fa-2x seller-img"></i>
          )}
          <div className="seller-name">
            <div>{user.name}</div>
            <div className="stars justify-content-center">
              {stars(user.score)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
