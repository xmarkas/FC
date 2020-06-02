import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavMenu extends Component {
  state = {};

  render() {
    return (
      <nav
        className="navbar navbar-expand-md navbar-light bg-white"
        style={{ width: "100%" }}
      >
        <Link to="/" className="navbar-brand d-flex">
          <img src={require("../media/foodCommuneLogo.gif")} alt=""></img>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav" style={{ minWidth: "50%" }}>
            <Link to="/" className="nav-item nav-link">
              About
            </Link>
            <Link to="/dashboard" className="nav-item nav-link">
              How it Works
            </Link>
            <Link to="/catalog" className="nav-item nav-link">
              Catalog
            </Link>
            <Link to="/groups" className="nav-item nav-link">
              Groups
            </Link>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Bulk Food Source
              </a>
              <div
                style={{ backgroundColor: "#f8f9fa" }}
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <a className="dropdown-item" href="#">
                  Fresh Produce
                </a>
                <a className="dropdown-item" href="#">
                  Meats & Poultry
                </a>
                <a className="dropdown-item" href="#">
                  Grains, Beans & Flour
                </a>
                <a className="dropdown-item" href="#">
                  Cheese & Dairy
                </a>
                <a className="dropdown-item" href="#">
                  Oils & Extracts
                </a>
                <a className="dropdown-item" href="#">
                  Specialty Foods
                </a>
                <a className="dropdown-item" href="#">
                  Spices & Stuff
                </a>
                <a className="dropdown-item" href="#">
                  Wine, Beer & Spirits
                </a>
              </div>
            </li>
          </div>
          {/* <!-- Login display --> */}
          <div
            className="navbar-nav wait-render"
            style={{
              width: "100%",
              display: "none",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <div id="open-account" className="nav-item nav-link user-false">
              Create Account
            </div>
            <div id="open-signin" className="nav-item nav-link user-false">
              Sign In
            </div>
            <div id="signout-go" className="nav-item nav-link user-true">
              Sign Out
            </div>
            <div className="user-true">
              <i className="fas fa-user-circle fa-2x mr-1 fc-green"></i>
              <span
                id="user"
                style={{ verticalAlign: "super", color: "dimgray" }}
              ></span>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavMenu;
