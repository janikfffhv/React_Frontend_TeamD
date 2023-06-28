// src/App.js

import React, {Component, useEffect} from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import {RiDeleteBin2Fill} from "react-icons/ri";
import {Navigate, useLocation} from "react-router";


class EventPlaces extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: [],
            searchName: "",
            eventLink: "",
            buysuccess: false,
            plaetze: []
        }
        this.videoStream = React.createRef();
    }


    hideModal = () => {
        document.getElementById("successPlace").classList.remove("show");
        document.getElementById("successPlace").style.display = "none";
    }
    hideError = () => {
        document.getElementById("errorPlace").classList.remove("show");
        document.getElementById("errorPlace").style.display = "none";
    }

    addToBasket = (placeId, eventName, termin, preis) => {
        var place = [placeId, eventName, termin, preis];
        var goodCheck = false;
        var basket = [];
        if (sessionStorage.getItem("basket") != null) {
            basket = JSON.parse(sessionStorage.getItem("basket"));
            for (var i = 0; i < basket.length; i++) {
                if (basket[i][0] === placeId) {
                    goodCheck = true;
                    document.getElementById("errorPlace").innerHTML = "Platz " + placeId + " ist bereits im Warenkorb!";
                    document.getElementById("errorPlace").classList.add("show");
                    document.getElementById("errorPlace").style.display = "";
                    setTimeout(this.hideError, 5000);
                }
            }
        }
        if (goodCheck === false) {
            basket.push(place);
            sessionStorage.setItem("basket", JSON.stringify(basket));
            document.getElementById("successPlace").innerHTML = "Platz " + placeId + " zum Warenkorb hinzugefügt!";
            document.getElementById("successPlace").classList.add("show");
            document.getElementById("successPlace").style.display = "";
            setTimeout(this.hideModal, 5000);
        }

    }


    componentDidMount() {
        console.log(sessionStorage.getItem("basket"));
        let videoPlayer = null;
        console.log(sessionStorage.getItem("eventId"));
        let link = "http://10.0.40.167:8080/backend-1.0-SNAPSHOT/api/teamd/event/searchById?id=" + sessionStorage.getItem("eventId");
        fetch(link)
            .then(async (res) => {
                if (res.status === 200) {
                    const creds = await res.json();
                    var plaetze = [];
                    for (let i = 0; i < creds.plaetze.length; i++) {
                        if (creds.plaetze[i].verkaufsId === "") {
                            plaetze.push(creds.plaetze[i]);
                        }
                    }
                    this.setState({plaetze: plaetze});
                    this.setState({table: creds});

                } else if (res.status === 401) {
                    // document.getElementById("failureAlert").style.display="block";
                    // document.getElementById("failureAlert").classList.add("show");
                }

            }).catch(console.log)
    }


    render() {


        function convertDate(unixString) {
            var t = new Date(unixString * 1000);
            var formatted = t.toLocaleString();
            return formatted;
        }

        return (
            <>
                <div
                    className=" transition ease-in-out delay-150 bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
                    id="successPlace" style={{zIndex: 999, display: "none"}} role="alert">
                </div>
                <div className=" transition ease-in-out delay-150 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                     id="errorPlace" style={{zIndex: 999, display: "none"}} role="alert">
                </div>
                <div className="m-10 flex items-center">
                    <h1 className="text-center font-bold text-3xl ml-40">{this.state.table.name}</h1>
                </div>
                <div className="flex items-center">
                    <div className="m-10">
                        <div
                            className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{convertDate(this.state.table.datum)}</h5>
                            <p className="mb-3 font-normal text-gray-700">{this.state.table.beschreibung}<br/><br/><b>{this.state.table.gebaeude} {this.state.table.raum}, {this.state.table.strasse} {this.state.table.hausnummer}, {this.state.table.plz} {this.state.table.ort}</b>
                            </p>
                        </div>
                    </div>
                    <table className="table text-center">
                        <thead>
                        <tr className="bg-emerald-300">
                            <th className="px-4 py-2">Platz</th>
                            <th className="px-4 py-2">Reihe</th>
                            <th className="px-4 py-2">Kategorie</th>
                            <th className="px-4 py-2">Preis</th>
                            <th className="px-4 py-2">Buchen</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.plaetze && this.state.plaetze.map((platz) => (
                            <tr className="bg-white test">
                                <td className="px-4 py-2">{platz.nummer}</td>
                                <td className="px-4 py-2">{platz.reihe}</td>
                                <td className="px-4 py-2">{platz.kategorie}</td>
                                <td className="px-4 py-2">{platz.preis} €</td>
                                <td className="px-4 py-2">
                                    <button
                                        className="text-white px-5 bg-blue-700 rounded-sm hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={() => this.addToBasket(platz.platzId, this.state.table.name, this.state.table.datum, platz.preis)}>Jetzt
                                        buchen
                                    </button>
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

export default EventPlaces;
