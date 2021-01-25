import React, { Component } from 'react';
import NavView from './NavView';




class Home extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        {/* <!-- ROW --> */}
        <div
          className="row row-border justify-content-center py-1"
          style={{ position: "relative", backgroundColor: "white" }}
        >
          <div id="top-slogan" className="indie-flower">
            Find food you can trust!
          </div>
          <div className="col-6 px-0">
            <img
              className="img-inherit"
              src={require("../media/cover002.jpg")}
              alt=""
            ></img>
          </div>
          <div className="col-6 px-0">
            <img
              className="img-inherit"
              src={require("../media/cover003.jpg")}
              alt=""
            ></img>
          </div>
        </div>

        {/* <!-- ROW --> */}
        <div
          className="row row-border py-1"
          style={{ backgroundColor: "white" }}
        >
          <div className="col-12">
            <div className="row check-content my-3">
              <div className="col-md-3">
                <img
                  className="checks"
                  // src="http://www.foodcommune.com/about/img/about-check1.gif"
                  alt=""
                ></img>

                <span className="indie-flower fc-green">
                  Farm To Table Trust
                </span>
              </div>
              <div className="col-md-3">
                <img
                  className="checks"
                  // src="http://www.foodcommune.com/about/img/about-check1.gif"
                ></img>
                <span className="indie-flower fc-green">
                  Community Involvement
                </span>
              </div>
              <div className="col-md-3">
                <img
                  className="checks"
                  // src="http://www.foodcommune.com/about/img/about-check1.gif"
                ></img>
                <span className="indie-flower fc-green">Lower Food Costs</span>
              </div>
              <div className="col-md-3">
                <img
                  className="checks"
                  // src="http://www.foodcommune.com/about/img/about-check1.gif"
                ></img>
                <span className="indie-flower fc-green">Healthy Eating</span>
              </div>
            </div>

            {/* <!-- ROW --> */}
            <div className="row">
              <div className="col text-center">
                <img
                  className="img-inherit"
                  style={{ maxWidth: "775px", minWidth: "360px" }}
                  src={require('../media/hderAd001.gif')}
                  alt=""
                ></img>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- ROW --> */}
        <div
          className="row get-started justify-content-center py-3"
          style={{
            background: "linear-gradient(159deg, #346802 72%, #34680294)"
          }}
        >
          <div className="col">
            <div
              className="row indie-flower pt-1"
              style={{
                fontSize: "xxx-large",
                color: "white",
                display: "flex",
                justifyContent: "center",
                marginBottom: "-25px"
              }}
            >
              How It Works
            </div>
            <div className="row justify-content-center mb-3">
              <div id="signup-1" style={{ color: "yellow", padding: "5px" }}>
                Sign-up and join a group{" "}
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="row step-container">
                  <div className="steps">
                    <i className="fas fa-circle fa-4x"></i>
                    <span className="step-number">1</span>
                  </div>
                  <div className="step-phrase">Organize Your Group!</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="row step-container">
                  <div className="steps">
                    <i className="fas fa-circle fa-4x"></i>
                    <span className="step-number">2</span>
                  </div>
                  <span className="step-phrase">Search For Food!</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="row step-container">
                  <div className="steps">
                    <i className="fas fa-circle fa-4x"></i>
                    <span className="step-number">3</span>
                  </div>
                  <span className="step-phrase">Make An Order!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- ROW --> */}
        <div className="row py-1">
          <div className="col" style={{ backgroundColor: "white" }}>
            <div
              className="row py-4"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <img src="./media/logo.PNG" alt=""></img>
              <span
                style={{
                  fontSize: "x-large",
                  padding: "5px",
                  color: "dimgray"
                }}
              >
                Recent Offers
              </span>
              <img src="./media/logo.PNG" alt=""></img>
            </div>
            {/* <!-- Catalog List --> */}
            <div
              className="row py-3"
              style={{ justifyContent: "center" }}
            ></div>
          </div>
        </div>

        {/* <!-- ROW --> */}
        <div className="row" id="content3">
          <div className="col content">
            <div
              className="row my-5 justify-content-center"
              style={{
                fontSize: "x-large",
                color: "var(--fc-orange)",
                fontStyle: "italic"
                        }}
                        
            >
              Sharing Strengthens Communities!
            </div>
            <div className="row my-5">
              <div className="col-md-3">
                <ul>
                  <li className="li-label">Catalog</li>
                  <li>
                    <a href="#">Fruit</a>
                  </li>
                  <li>
                    <a href="#">Vegetables</a>
                  </li>
                  <li>
                    <a href="#">Meats, Poultry and Seafood</a>
                  </li>
                  <li>
                    <a href="#">Other</a>
                  </li>
                </ul>
              </div>
              <div className="col-md-3">
                <ul>
                  <li className="li-label">Guides and Support</li>
                  <li>
                    <a href="#">How to sell and post offers</a>
                  </li>
                  <li>
                    <a href="#">Best practices for group purchases</a>
                  </li>
                  <li>
                    <a href="#">Get help finding products</a>
                  </li>
                </ul>
              </div>
              <div className="col-md-3">
                <ul>
                  <li className="li-label">News and Notifications</li>
                  <li>
                    <a href="#">Find out about seasonal products</a>
                  </li>
                  <li>
                    <a href="#">Sign-up for new product alerts</a>
                  </li>
                </ul>
              </div>
              <div className="col-md-3">
                <ul>
                  <li className="li-label">Contact</li>
                  <li>Food Commune</li>
                  <li>Seattle, Wa</li>
                  <li>(206) 355-0133</li>
                  <li>
                    <a href="#">Support Portal</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;