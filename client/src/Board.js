
import React, { Component } from 'react';
import Column from "./Column.js";
import axios from 'axios';

class Board extends Component {
    state = {
        id: this.props.id,
        name: null,
        columnIds: [],
        intervalIsSet: false,

    }

    // when component mounts, first thing it does is fetch all existing data in our db
    // then we incorporate a polling logic so that we can easily see if our db has
    // changed and implement those changes into our UI
    componentDidMount() {
        this.getBoardFromDb();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getBoardFromDb, 1000);
            this.setState({ intervalIsSet: interval });
        }
    }

    // never let a process live forever
    // always kill a process everytime we are done using it
    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({ intervalIsSet: null });
        }
    }

    // rfdolan
    // Function to render the tasks in a column based off of their ids
    renderColumns() {
        //console.log(this.state.columnIds)
        let columns = [];
        for (let i = 0; i < this.state.columnIds.length; i++) {
            columns.push(<Column id={this.state.columnIds[i]} />);
        }
        return columns;
    }

    getBoardFromDb = () => {
        //console.log("Getting object " + this.state.id);
        axios.get('http://localhost:3001/api/getSingleObject', {
            params: {
                objId: this.state.id
            }
        }).then((res) => { this.setState({ columnIds: res.data.objectInfo.columnIds }) });
    };

    // TODO move all style to a stylesheet
    // TODO add button functionality to add a column
    render() {
        return (
            <div>
                <h2>Hello this is a board</h2>
                <div style={{display:"flex","overflow-x":"scroll",whitespace: "nowrap", border: "5px solid green", padding:"5px"}}>
                    {this.renderColumns()}
                    
                    <button style={{flex:"none", height:"20px"}}>Create new column</button>
                </div>

            </div>
        )
    }

};

export default Board;