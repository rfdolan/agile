import React, { Component } from "react";
import Board from "./Board.js";
import "./MainApp.css";

class MainApp extends Component {

    render() {
        return (
            <div className="mainApp">
                <div className="header">
                    <h1>A. G. I. L. E.</h1>
                </div>
                <div className="board">
                    <Board />
                </div>
            </div>
        )
    }
}

export default MainApp;