import React, { Component } from 'react';
import Board from "./Board.js";
import base_url from './api.js';
//import axios from 'axios';

const create_url = base_url + 'createBoard'
const get_url = base_url + 'getBoard'
class App extends Component {
  // initialize our state
  state = {

    boardId: '',
    boardName: null,
    boardCreatedAt: null,

    newBoardName: '',

    showWelcome: true
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    //this.getBoardById();
    /*
      if (!this.state.intervalIsSet) {
          let interval = setInterval(this.getBoardById(), 1000);
          this.setState({ intervalIsSet: interval });
      }
      */
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  /*
  componentDidUpdate(prevProps, prevState) {
    if(prevState.boardName != this.state.boardName)
      this.renderBoard();
  }
  */

  createNewBoard = (e) => {
    let newName = encodeURIComponent(this.state.newBoardName)
    fetch(create_url + `?name=${newName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'applications/json'
      }
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
          let status = result.statusCode
          if (status === 200) {
          } else {
            console.log("Error creating board")
          }
          this.setState({ newBoardName: '' })
        }
      );
  }


  renderBoard = () => {
    //console.log("render board " + this.state.boardId + ", " + this.state.boardName);
    return <div>
      <Board
        id={this.state.boardId}
        name={this.state.boardName}
        createdAt={this.state.boardCreatedAt} />
    </div>
  }

  getBoardById = (e) => {
    let boardId = encodeURIComponent(this.state.boardId)
    fetch(get_url + `?id=${boardId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'applications/json'
      }
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
          let status = result.statusCode
          if (status === 200) {
            let board = result.board
            this.setState({
              boardId: board.board_id,
              boardName: board.name,
              boardCreatedAt: board.created_at,
              showWelcome: false
            })
          } else {
            console.log("No board exists")
          }
          this.setState({ boardId: '' })
        }
      );
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  renderWelcome = () => {
    return <div>
      <div>
        <label>New Board Name:
            <input name="newBoardName" value={this.state.newBoardName}
            onChange={e => this.handleChange(e)}></input>
        </label>
        <button type="button" onClick={(e) => this.createNewBoard(e)}>Create New Board</button>
      </div>
      <div>
        <label>Board Id:
            <input name="boardId" value={this.state.boardId}
            onChange={e => this.handleChange(e)}></input>
        </label>
        <button type="button" onClick={(e) => this.getBoardById(e)}>Get Board</button>
      </div>
    </div>
  }

  render() {
    //console.log("rendering");
    return (
      <div>
        {this.state.showWelcome ? this.renderWelcome() : this.renderBoard()}
      </div>
    )
  }
}

export default App;