// src/App.js

import React, {Component} from 'react';
import {RiDeleteBin2Fill} from "react-icons/ri";
import {Navigate} from "react-router";

import {AiFillStar, AiOutlineStar} from "react-icons/ai";


class EventSearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: [],
            searchName: "",
            eventsuccess: false,
            artState: ""
        }
    }

    searchByName(art) {
        let link = "";
        if (art === "state") {
            art = this.state.artState;
        }
        if (art === "name") {
            const searchName = document.getElementById("searchterm")?.value;
            link = "http://10.0.40.167:8080/backend-1.0-SNAPSHOT/api/teamd/event/searchByString?eventname=" + searchName;
            this.setState({artState: "name"});
        } else if (art === "kategorie") {
            const kat = document.getElementById("categorysel")?.value;
            link = "http://10.0.40.167:8080/backend-1.0-SNAPSHOT/api/teamd/event/searchByCategory?kategorie=" + kat;
            this.setState({artState: "kategorie"});
        } else if (art === "zeitraum") {
            const d1 = Math.floor(new Date(document.getElementById("startDate")?.value).getTime() / 1000);
            const d2 = Math.floor(new Date(document.getElementById("endDate")?.value).getTime() / 1000);
            link = "http://10.0.40.167:8080/backend-1.0-SNAPSHOT/api/teamd/event/searchByDate?startDate=" + d1 + "&endDate=" + d2;
            this.setState({artState: "zeitraum"});
        }
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
                                        creds[i]["favorit"] = <AiOutlineStar/>;
                                    }
                                    console.log(creds[i].datum);
                                    const timestampMillis = Date.now();
                                    const timestampSeconds = Math.floor(timestampMillis / 1000);
                                    if (creds[i].datum < timestampSeconds) {
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
                                    this.searchByName("state");
                                }
                            });
                    } else {
                        let link2 = "http://52.166.109.86:8080/wishlist/add/" + sessionStorage.getItem("userid") + "/" + eventId;
                        fetch(link2)
                            .then(async (res) => {
                                if (res.status === 200) {
                                    this.searchByName("state");
                                }
                            });
                    }
                }
                ;
            }).catch(console.log);
    }

    stateChanger = () => {
        this.setState({eventsuccess: true});
    }

    eventDetails = (event) => {
        sessionStorage.setItem('eventId', event.eventId);
        console.log(event.eventId);
        this.stateChanger();
    }

    render() {


        function convertDate(unixString) {
            var t = new Date(unixString * 1000);
            var formatted = t.toLocaleString();
            return formatted;
        }

        return (
            <>
                {this.state.eventsuccess && (
                    <Navigate to="/Eventdetails" replace={true}/>
                )}
                <div className="m-10 flex items-center">
                    <button className="flex items-center p-1 bg-slate-300 border-2 border-slate-600 rounded w-52">
                        <RiDeleteBin2Fill className="mr-2"/> Filter zurücksetzen
                    </button>
                    <h1 className="text-center font-bold text-3xl ml-40">Finde dein Traumevent!</h1>
                </div>
                <div className="flex items-center">
                    <div className="m-10">
                        <div className="mb-5">
                            <label htmlFor="term" id="term"><h2 className="font-bold text-lg">Suchbegriff:</h2></label>
                            <input type="text"
                                   placeholder="z.B. Name, PLZ, Ort, Veranstalter, ..."
                                   className="pl-1 w-7/12 border-2 border-emerald-400 rounded" id="searchterm"/>
                            <button className="ml-5 bg-emerald-300 rounded px-2"
                                    onClick={() => this.searchByName("name")}>Nach Begriff suchen
                            </button>
                        </div>


                        <div className="mb-5">
                            <label htmlFor="category"><h2 className="font-bold text-lg">Kategorie:</h2></label>
                            <select name="category" id="categorysel"
                                    className="w-7/12 border-2 border-emerald-400 rounded">
                                <option value="KINO">Kino</option>
                                <option value="THEATER">Theater</option>
                                <option value="KONZERT">Konzert</option>
                            </select>
                            <button className="ml-5 bg-emerald-300 rounded px-2"
                                    onClick={() => this.searchByName("kategorie")}>Nach Kategorie suchen
                            </button>
                        </div>


                        <h2 className="font-bold text-lg">Zeitraum:</h2>
                        <div className="flex items-center">
                            <div className="w-7/12 flex items-center">
                                <div className="mr-10">
                                    <label htmlFor="startDate">von:</label>
                                    <input type="date" id="startDate"
                                           className="pl-1 border-2 border-emerald-400 rounded"/>
                                </div>

                                <div>
                                    <label htmlFor="endDate">bis:</label>
                                    <input type="date" id="endDate"
                                           className="pl-1 border-2 border-emerald-400 rounded"/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="ml-5 mt-5 bg-emerald-300 rounded px-2"
                                    onClick={() => this.searchByName("zeitraum")}>Nach Zeitraum suchen
                            </button>
                        </div>
                    </div>
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
        )
    }


}

export default EventSearchPage;
