import React, { Component } from "react";
import { CatalogActions } from "./ItemViewOption";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    user: state.user,
    token: state.token
  };
};

class Catalog extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="row justify-content-center py-3">
          <div className="col-md-12 col-lg-10">
            <div className="catalog-center">
              <ul
                id="catalog-wrapper"
                className="m-2 p-2"
                style={{ listStyle: "none" }}
              >
                {this.props.userClans && this.props.data.Deals.map((item, index) => {
                  let target = item.description.toUpperCase();
                  if (target.includes(this.props.searchValue.toUpperCase())) {
                    return CatalogItem(item, index, this.props.userClans, this);
                  }
                })}
              </ul>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(Catalog);

function CatalogItem(item, index, clans, self) {
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
    <li
      key={index}
      className="item-list-wrap my-2"
      style={{
        backgroundColor: index % 2 === 0 ? "white" : "white"
      }}
    >
      <div
        className="row"
        style={{
          textDecoration: "none",
          color: "dimgray",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "15px",
            color: "lightgrey",
            display: "none",
            fontSize: "1rem"
          }}
          className="fas fa-pencil-alt fa-1x"
        ></div>
        <div className="col-6 col-sm-4 col-md-3 mb-2 mb-md-0">
          {item.image_url && (
            <img
              src={"/Uploads/Deal_Images/" + item.image_url}
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
        <div className="col-6 col-sm-3 col-md-3">
          <div className="item-description">{item.description}</div>
          <div className="item-info my-2">
            {item.units} {item.unit_measure} for ${item.price}
          </div>
          {item.seller_name && (
            <div className="item-seller mt-3">
              <img
                className="seller-img"
                src={"/Uploads/Profile_Images/" + item.seller_image}
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
          <div className="row" style={{ alignSelf: "flex-end",justifySelf: "flex-end"}}>
            {CatalogActions(self.props.token, clans, self.props.user.id, item)}
          </div>
        </div>
      </div>
    </li>
  );
}

function catalogItem(item, index, user, props) {
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
      onClick={() => props.itemView(index)}
      key={index}
      className="catalog-item m-2"
      style={{ width: "175px", position: "relative", cursor: "pointer" }}
    >
      <div className="item-header">
        {item.image_url && (
          <img
            src={"/Uploads/Deal_Images/" + item.image_url}
            alt=""
          ></img>
        )}
        {!item.image_url && (
          <img
            src="/media/no_image.png"
            alt=""
            style={{ alignSelf: "flex-end" }}
          ></img>
        )}
      </div>
      <div className="item-info-group">
        <div className="item-description">{item.description}</div>
        <div className="item-info">
          {item.units} {item.unit_measure} for ${item.price}
        </div>
        <div className="item-seller">
          {item.seller_image && (
            <img
              className="seller-img"
              src={"/Uploads/Profile_Images/" + item.seller_image}
              alt=""
            ></img>
          )}
          {!item.seller_image && (
            <i className="fas fa-user-circle fa-2x seller-img"></i>
          )}
          <div className="seller-name">
            <div>{item.seller_name}</div>
            <div className="stars justify-content-center">
              {stars(item.user_score)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
