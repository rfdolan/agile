import React, {Component} from "react";
import "./Board.css";

class Board extends Component {


    render() {
        return (
            <div className="board">
                <h3>Greetings from Board!</h3>
                <div className="column">
                    <h4>Hello there</h4>
                </div>
                <div className="column">
                    <h4>Hello there</h4>
                </div>
                <div className="column">
                    <h4>Hello there</h4>
                </div>
                <div className="column">
                    <h4>Hello there</h4>
                </div>
            </div>
        )
    }
}


export default Board;