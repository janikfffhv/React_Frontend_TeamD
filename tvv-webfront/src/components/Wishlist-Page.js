// src/App.js

import React, {Component} from 'react';
import {AiFillStar, AiOutlineStar} from "react-icons/ai";


class WishlistPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: [],
        }
    }

    refreshWishlist = () => {
        let link = "http://10.0.40.167:8080/backend-1.0-SNAPSHOT/api/teamd/event/searchByString?eventname=";
        fetch(link)
            .then(async (res) => {
                if (res.status === 200) {
                    const creds = await res.json();
                    let link2 = "http://52.166.109.86:8080/wishlist/" + sessionStorage.getItem("userid");
                    fetch(link2)
                        .then(async (res) => {
                            if (res.status === 200) {
                                const wishlist = await res.json();
                                console.log("Wishlist: " + wishlist);
                                for (let i = 0; i < creds.length; i++) {
                                    if (wishlist.toString().split(",").includes(creds[i].eventId.toString())) {
                                        creds[i]["favorit"] = <AiFillStar/>;
                                    } else {
                                        delete creds[i];
                                    }
                                }
                            }
                            this.setState({table: creds});
                        }).catch(console.log);
                    console.log(creds);

                    //document.getElementById("successLogon")!.innerHTML = "Successfully logged in as " + creds.cinfo.name + "!";
                    //document.getElementById("successLogon")!.classList.add("show"); document.getElementById("successLogon")!.style.display="";
                    //setTimeout(function() {document.getElementById("successLogon")!.classList.remove("show"); document.getElementById("successLogon")!.style.display="none"}, 5000);
                    //this.randomNavbar();
                } else if (res.status === 401) {
                    // document.getElementById("failureAlert").style.display="block";
                    // document.getElementById("failureAlert").classList.add("show");
                }

            }).catch(console.log)
    }

    pushFavourite = (eventId) => {
        let link2 = "http://52.166.109.86:8080/wishlist/" + sessionStorage.getItem("userid");
        fetch(link2)
            .then(async (res) => {
                if (res.status === 200) {
                    const wishlist = await res.json();
                    if (wishlist.toString().split(",").includes(eventId.toString())) {
                        let link2 = "http://52.166.109.86:8080/wishlist/remove/" + sessionStorage.getItem("userid") + "/" + eventId;
                        fetch(link2)
                            .then(async (res) => {
                                if (res.status === 200) {
                                    this.refreshWishlist();
                                }
                            });
                    } else {
                        let link2 = "http://52.166.109.86:8080/wishlist/add/" + sessionStorage.getItem("userid") + "/" + eventId;
                        fetch(link2)
                            .then(async (res) => {
                                if (res.status === 200) {
                                    this.refreshWishlist();
                                }
                            });
                    }
                }
                ;
            }).catch(console.log);
    }
    refreshWishList = () => {

    }

    componentDidMount() {
        this.refreshWishlist();

    }


    render() {
        function convertDate(unixString) {
            var t = new Date(unixString * 1000);
            var formatted = t.toLocaleString();
            return formatted;
        }

        return (
            <>
                <div className="m-10 flex items-center">
                    <table className="table text-center">
                        <thead>
                        <tr className="bg-emerald-300">
                            <th className="px-4 py-2">Event</th>
                            <th className="px-4 py-2">Termin</th>
                            <th className="px-4 py-2">Veranstaltungsort</th>
                            <th className="px-4 py-2">Ticket-Verfügbarkeit</th>
                            <th className="px-4 py-2">Favorit</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.table && this.state.table.map((event) => (
                            <tr className="bg-white test">
                                <td className="px-4 py-2">
                                    <button onClick={() => this.eventDetails(event)}>{event.name}</button>
                                </td>
                                <td className="px-4 py-2">{convertDate(event.datum)}</td>
                                <td className="px-4 py-2">{event.ort}</td>
                                <td className="px-4 py-2">{event.plaetzeVerfuegbar}</td>
                                <td className="px-4 py-2">
                                    <button onClick={() => this.pushFavourite(event.eventId)}>{event.favorit}</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>
            </>
        );
    }


}

export default WishlistPage;
