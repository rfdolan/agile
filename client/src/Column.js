import React, { Component } from 'react';
import Task from "./Task.js";
import axios from 'axios';

class Column extends Component {
    state = {
        id: this.props.id,
        name: null,
        taskIds: [],
        intervalIsSet: false,

    }

    // when component mounts, first thing it does is fetch all existing data in our db
    // then we incorporate a polling logic so that we can easily see if our db has
    // changed and implement those changes into our UI
    componentDidMount() {
        this.getColumnFromDb();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getColumnFromDb, 1000);
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
    renderTasks() {
        let tasks = [];
        for (let i = 0; i < this.state.taskIds.length; i++) {
            tasks.push(<Task mongoObjectId={this.state.taskIds[i]} />);
        }
        return tasks;
    }

    getColumnFromDb = () => {
        //console.log("Getting Column " + this.state.id);
        axios.get('http://localhost:3001/api/getSingleObject', {
            params: {
                objId: this.state.id
            }
        }).then((res) => { this.setState({ taskIds: res.data.objectInfo.taskIds }) });
    };

    // TODO add button functionality to add a task
    render() {
        return (
            <div style={{ display: "inline-block", border: "5px solid red", padding: "5px", margin: "5px" }}>
                <h3>Hello this is a column</h3>
                {this.renderTasks()}
                <button>Add task</button>

            </div>
        )
    }

};

export default Column;