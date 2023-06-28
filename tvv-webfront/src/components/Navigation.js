// src/App.js

import React, {Component} from 'react';
import {Route, Routes} from "react-router";
import {AiOutlineFileSearch, AiOutlineLogin} from "react-icons/ai";
import {SlBasket, SlStar} from "react-icons/sl";
import {NavLink} from "react-router-dom";
import logo from "../logo.png";


class Navigation extends Component {

    render() {
        const isLoggedIn = sessionStorage.getItem("user");
        let button;
        console.log(isLoggedIn);
        if (isLoggedIn === "empty" || isLoggedIn === null) {
            button = <NavLink to="/Login">Login</NavLink>;
        } else {
            button = <NavLink to="/Login">Logout</NavLink>;
        }

        return (
            <div className="grid grid-rows-1 grid-flow-col gap-1 bg-emerald-300 h-20">
                <div>
                    <img src={logo} alt="TVV" height="10px" width="280px"/>
                </div>
                <div className="flex items-center">
                    <AiOutlineFileSearch/> <span className="ml-2"></span><NavLink to="/Eventsuche">Eventsuche</NavLink>
                </div>
                <div className="flex items-center">
                    <SlBasket/> <span className="ml-2"><NavLink to="/Warenkorb">Warenkorb</NavLink></span>
                </div>
                <div className="flex items-center">
                    <SlStar/> <span className="ml-2"><NavLink to="/Wishlist">Favoriten</NavLink></span>
                </div>
                <div className="flex items-center">
                    <AiOutlineLogin/> <span className="ml-2">{button}</span>
                </div>

            </div>
        );
    }


}

export default Navigation;
