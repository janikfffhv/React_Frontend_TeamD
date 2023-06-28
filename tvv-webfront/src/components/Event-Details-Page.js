// src/App.js

import React, {Component, useEffect} from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import {RiDeleteBin2Fill} from "react-icons/ri";
import {Navigate, useLocation} from "react-router";


class EventDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: [],
            searchName: "",
            eventLink: "",
            buysuccess: false
        }
        this.videoStream = React.createRef();
    }

    hideError = () => {
        document.getElementById("errorPlace").classList.remove("show");
        document.getElementById("errorPlace").style.display = "none";
    }

    eventDetails = () => {
        if (sessionStorage.getItem("userid") != null) {
            this.setState({buysuccess: true});
        } else {
            document.getElementById("errorPlace").innerHTML = "Zum Fortfahren bitte einloggen!";
            document.getElementById("errorPlace").classList.add("show");
            document.getElementById("errorPlace").style.display = "";
        }

    }

    componentDidMount() {
        let videoPlayer = null;
        let link = "http://10.0.40.167:8080/backend-1.0-SNAPSHOT/api/teamd/event/searchById?id=" + sessionStorage.getItem("eventId");
        fetch(link)
            .then(async (res) => {
                if (res.status === 200) {
                    const creds = await res.json();
                    this.setState({table: creds});
                    //document.getElementById("successLogon")!.innerHTML = "Successfully logged in as " + creds.cinfo.name + "!";
                    //document.getElementById("successLogon")!.classList.add("show"); document.getElementById("successLogon")!.style.display="";
                    //setTimeout(function() {document.getElementById("successLogon")!.classList.remove("show"); document.getElementById("successLogon")!.style.display="none"}, 5000);
                    //this.randomNavbar();
                    let link = "http://52.166.109.86:8080/streaming/" + sessionStorage.getItem("eventId");
                    this.setState({eventLink: link});
                    fetch(link)
                        .then((response) => response.blob())
                        .then((blob) => {
                            const url = URL.createObjectURL(blob);

                            videoPlayer = videojs(this.videoStream.current, {
                                controls: true
                            });
                            videoPlayer.src({src: url, type: 'video/mp4'});
                        }).catch(console.log)


                } else if (res.status === 401) {
                    // document.getElementById("failureAlert").style.display="block";
                    // document.getElementById("failureAlert").classList.add("show");
                }

            }).catch(console.log)

        this.deletePlayer = () => {
            if (videoPlayer) {
                videoPlayer.dispose();
            }
        }
    }

    componentWillUnmount() {
        this.deletePlayer();
    }


    render() {


        function convertDate(unixString) {
            var t = new Date(unixString * 1000);
            var formatted = t.toLocaleString();
            return formatted;
        }

        return (
            <>
                {this.state.buysuccess && (
                    <Navigate to="/Eventplaces" replace={true}/>
                )}
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
                            <a onClick={() => this.eventDetails()}
                               className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Jetzt buchen
                                <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor"
                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                          clip-rule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="h-50">

                        <video
                            src={this.state.eventLink}
                            controls
                            className="h-80"
                        />
                    </div>
                </div>

            </>
        )
    }


}

export default EventDetails;
