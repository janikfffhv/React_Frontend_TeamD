// src/App.js

import React, {Component} from 'react';


class ShoppingCartPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: [],
        }
    }

    componentDidMount() {
        var basket = JSON.parse(sessionStorage.getItem("basket"));
        console.log(basket);
        this.setState({table: basket});

    }

    removeFromBasket = (platzid) => {
        let basket2 = JSON.parse(sessionStorage.getItem("basket"));
        for (let i = 0; i < basket2.length; i++) {
            if (basket2[i][0] === platzid) {
                delete basket2[i];
                this.setState({table: basket2});
                sessionStorage.setItem("basket", basket2);
            }
        }
    }
    hideModal = () => {
        document.getElementById("successPlace").classList.remove("show");
        document.getElementById("successPlace").style.display = "none";
    }
    hideError = () => {
        document.getElementById("errorPlace").classList.remove("show");
        document.getElementById("errorPlace").style.display = "none";
    }

    confirmPurchase() {
        var basket = JSON.parse(sessionStorage.getItem("basket"));
        var username = sessionStorage.getItem("userid");
        var plaetze = basket[0][0];
        var preis = parseInt(basket[0][3]);
        for (var i = 1; i < basket.length; i++) {
            plaetze += "," + basket[i][0];
            preis += parseInt(basket[i][3]);
        }
        let link = "http://10.0.40.167:8080/backend-1.0-SNAPSHOT/api/teamd/verkauf/kaufe?username=" + username + "&platzId=" + plaetze + "&preis=" + preis + "&zahlungsmethode=KREDITKARTE";
        fetch(link)
            .then(async (res) => {
                if (res.status === 200) {
                    document.getElementById("successPlace").innerHTML = "Erfolgreich gekauft!";
                    document.getElementById("successPlace").classList.add("show");
                    document.getElementById("successPlace").style.display = "";
                    setTimeout(this.hideModal, 5000);
                    this.setState({table: []});
                    sessionStorage.removeItem("basket");

                } else if (res.status === 400) {
                    document.getElementById("errorPlace").innerHTML = "Einer der Plätze wurde bereits gekauft!";
                    document.getElementById("errorPlace").classList.add("show");
                    document.getElementById("errorPlace").style.display = "";
                    setTimeout(this.hideError, 5000);
                }

            }).catch(console.log)
    }

    render() {
        function convertDate(unixString) {
            var t = new Date(unixString * 1000);
            return t.toLocaleString();
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
                    <table className="table text-center">
                        <thead>
                        <tr className="bg-emerald-300">
                            <th className="px-4 py-2">Event</th>
                            <th className="px-4 py-2">Datum</th>
                            <th className="px-4 py-2">Platz</th>
                            <th className="px-4 py-2">Preis</th>
                            <th className="px-4 py-2">L&ouml;schen</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.table && this.state.table.map((platz) => (
                            <tr className="bg-white test">
                                <td className="px-4 py-2">{platz[1]}</td>
                                <td className="px-4 py-2">{convertDate(platz[2])}</td>
                                <td className="px-4 py-2">{platz[0]}</td>
                                <td className="px-4 py-2">{platz[3]} €</td>
                                <td className="px-4 py-2">
                                    <button
                                        className="text-white px-5 bg-red-700 rounded-sm hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                        onClick={() => this.removeFromBasket(platz[0])}>Entfernen
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="m-10 flex items-center">
                    <div className="mb-5">
                        <label htmlFor="term" id="term"><h2 className="font-bold text-lg">Kreditkartennummer:</h2>
                        </label>
                        <input type="text"
                               placeholder="1234 5689 9012 3456"
                               className="pl-1 w-7/12 border-2 border-emerald-400 rounded" id="cardNumber"/>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="term" id="term"><h2 className="font-bold text-lg">Gültig bis (MM/JJ):</h2>
                        </label>
                        <input type="text"
                               placeholder="12/23"
                               className="pl-1 w-7/12 border-2 border-emerald-400 rounded" id="cardNumber"/>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="term" id="term"><h2 className="font-bold text-lg">CVV:<br/></h2></label>
                        <input type="text"
                               placeholder="123"
                               className="pl-1 w-7/12 border-2 border-emerald-400 rounded" id="cardNumber"/>
                    </div>
                    <button
                        className="text-white px-5 bg-green-700 rounded-sm hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        onClick={() => this.confirmPurchase()}>Kaufen
                    </button>

                </div>
            </>
        );
    }


}

export default ShoppingCartPage;
