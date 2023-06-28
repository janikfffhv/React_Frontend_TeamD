// src/App.js

import React, {Component} from 'react';
import {Navigate, useNavigate} from "react-router";


class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "empty",
            pass: "empty",
            logsuccess: false
        };
    }

    stateChanger = () => {
        this.setState({logsuccess: true});
        window.location.replace("/Eventsuche");
    }
    login = () => {
        var uservar = document.getElementById("useridin").value;
        var passvar = document.getElementById("password").value;
        this.setState({pass: passvar});
        this.setState({user: uservar});
        let link = "http://10.0.40.167:8080/backend-1.0-SNAPSHOT/api/teamd/login/login?username=" + uservar + "&password=" + passvar;
        fetch(link)
            .then(async (res) => {
                if (res.status === 200) {
                    let creds = await res.json();
                    console.log(creds);
                    sessionStorage.setItem('user', this.state.user);
                    sessionStorage.setItem('password', this.state.pass);
                    sessionStorage.setItem('userid', creds.cid);
                    document.getElementById("successLogon").innerHTML = "Successfully logged in as " + creds.cinfo.name + "!";
                    document.getElementById("successLogon").classList.add("show");
                    document.getElementById("successLogon").style.display = "";
                    setTimeout(this.stateChanger, 5000);
                    //this.randomNavbar();
                } else if (res.status === 401) {
                    // document.getElementById("failureAlert").style.display="block";
                    // document.getElementById("failureAlert").classList.add("show");
                }


            }).catch(console.log)

    }

    render() {
        return (
            <div>
                {this.state.logsuccess && (
                    <Navigate to="/Eventsuche" replace={true}/>
                )}
                <div
                    className=" transition ease-in-out delay-150 bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
                    id="successLogon" style={{zIndex: 999, display: "none"}} role="alert">
                </div>
                <h1 className="text-center font-bold text-3xl my-5">
                    Willkommen bei TVV!
                </h1>
                <h2 className="text-center font-bold text-xl my-5">Bitte geben sie ihre Login-Daten ein!</h2>
                <div className="mx-auto w-2/5 text-center">

                    <div className="mb-5">
                        <label htmlFor="user-id" id="user-id">
                            <h2 className="font-bold text-lg">User-Id:</h2>
                        </label>
                        <input type="text" placeholder="....................." className="pl-1 w-7/12 border-2
                 border-emerald-400 rounded" id="useridin"/>
                    </div>

                    <div>
                        <label htmlFor="term" id="term">
                            <h2 className="font-bold text-lg">Passwort:</h2>
                        </label>
                        <input type="password" placeholder="***********" className="pl-1 w-7/12 border-2
                 border-emerald-400 rounded" id="password"/>
                    </div>
                </div>
                <button onClick={this.login} className="p-1 mx-auto block mt-5 bg-emerald-300 rounded px-2 ">
                    Login
                </button>
            </div>
        );
    }


}

export default LoginPage;
