import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faChartColumn,
  faGear,
  faMinusCircle,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../Providers/AuthProvider";
import logo from "../../logo.svg";
import "./SideNav.css";

const SideNav = ({ children, compact }) => {
  const navItems = [
    {
      label: "Homepage",
      path: "/homepage",
      icon: faCalendar,
      roles: ["teacher", "admin"],
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: faChartColumn,
      roles: ["teacher", "admin"],
    },
    {
      label: "Account",
      path: "/account",
      icon: faGear,
      roles: ["teacher", "admin", "student"],
    },
  ];

  const auth = useAuth();

  const navigate = useNavigate();

  return (
    <div className="SideNav__container">
      <div className={`SideNav__navbar ${compact ? "compact" : ""}`}>
        <div className="SideNav__nav-top">
          <Link to="/classes">
            <img
              className={`SideNav__logo ${compact ? "compactLogo" : ""}`}
              src={logo}
              alt="Brite"
            />
          </Link>
        </div>

        <ul className="SideNav__list">
          <li className="SideNav__nav-item">
            <button
              className="SideNav__nav-link"
              onClick={() => auth.logout(navigate)}
            >
              <FontAwesomeIcon icon={faMinusCircle} />
              {compact === false && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </div>
      <div
        className={
          compact ? "SideNav__page-content-compact" : "SideNav__page-content"
        }
      >
        {children}
      </div>
    </div>
  );
};

export default SideNav;
