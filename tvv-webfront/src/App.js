// src/App.js

import React, {Component} from 'react';
import {Route, Routes} from "react-router";
import EventSearchPage from "./components/Event-Search-Page";
import LoginPage from "./components/Login-Page";
import ShoppingCartPage from "./components/Shopping-Cart-Page";
import Navigation from "./components/Navigation";
import EventDetails from "./components/Event-Details-Page";
import EventPlaces from "./components/Event-Places-Page";
import WishlistPage from "./components/Wishlist-Page";


class App extends Component {
    state = {
        userId: "",
    };

    constructor(props) {
        super(props);
        this.state = {
            userId: "",
        }
    }


    render() {

        return (
            <>
                <Navigation/>
                <Routes>
                    <Route path="/" element={<EventSearchPage/>}></Route>
                    <Route path="Eventsuche" element={<EventSearchPage/>}/>
                    <Route path="Warenkorb" element={<ShoppingCartPage/>}/>
                    <Route path="Login" element={<LoginPage/>}/>
                    <Route path="Eventdetails" element={<EventDetails/>}/>
                    <Route path="Eventplaces" element={<EventPlaces/>}/>
                    <Route path="Wishlist" element={<WishlistPage/>}/>
                </Routes>
            </>
        );
    }


}

export default App;
