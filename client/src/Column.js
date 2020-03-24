import React, { Component } from 'react';
import Task from "./Task.js";
import EditableElement from "./EditableElement";
import axios from 'axios';
import base_url from './api'

const get_tasks_url = base_url + 'getColumnTasks'
const create_task_url = base_url + 'createTask'
const delete_url = base_url + 'deleteColumn'
class Column extends Component {
    state = {
        id: this.props.id,
        name: this.props.name,
        information: null,
        tasks: [],
        intervalIsSet: false,
        loadedTasks: false,
        newTaskName: ''

    }

    // when component mounts, first thing it does is fetch all existing data in our db
    // then we incorporate a polling logic so that we can easily see if our db has
    // changed and implement those changes into our UI
    componentDidMount() {
        this.getTasks();
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

    //TODO rewrite
    updateDB = (fieldToUpdate, updateToApply) => {
        console.log("Updating " + fieldToUpdate + " to be " + updateToApply + " on id " + this.state.id);
        //parseInt(idToUpdate);

        axios.post('http://localhost:3001/api/updateColumn', {
            id: this.state.id,
            update: { [fieldToUpdate]: updateToApply },
        });
    };

    renderName = (propName, propContent) => {

        return <div>
            <EditableElement
                elementType="h2"
                content={propContent}
                updateProp={this.updateDB}
                fieldName={propName}
            />
        </div>
    }

    // rfdolan
    // Function to render the tasks in a column based off of their ids
    renderTasks = () => {
        let tasks = [];
        for (let i = 0; i < this.state.tasks.length; i++) {
            let curr = this.state.tasks[i]
            tasks.push(<Task key={curr.task_id} id={curr.task_id} name={curr.name} description={curr.description}
                deleteCallback={this.getTasks} />);
            //HACK since elemets of list need unique id, I just use the negative of the unique task id
            tasks.push(<br key={curr.task_id * -1} />);
        }
        return tasks;
    }

    // Gets columns for this board
    getTasks = (e) => {
        let columnId = encodeURIComponent(this.state.id)
        fetch(get_tasks_url + `?id=${columnId}`, {
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
                        let tasks = result.tasks
                        console.log(tasks)
                        this.setState({
                            tasks: tasks,
                            loadedTasks: true
                        })
                    } else {
                        console.log("Error getting tasks")
                    }
                }
            );
    };

    createNewTask = (e) => {
        if (this.state.newTaskName === '') { return; }
        let newName = encodeURIComponent(this.state.newTaskName)
        let colId = encodeURIComponent(this.state.id)
        fetch(create_task_url + `?name=${newName}&id=${colId}`, {
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
                        this.setState({
                            tasks: result.tasks,
                            newTaskName: ''
                        })
                    } else {
                        console.log("Error creating task")
                    }
                }
            );
    }

    deleteColumn = (e) => {
        if (window.confirm("Are you sure you want to delete this column?")) {
        let columnId = encodeURIComponent(this.state.id)
        fetch(delete_url + `?id=${columnId}`, {
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
                console.log("Calling callback")
                this.props.deleteCallback()
                } else {
                console.log("Error deleting column")
                }
            }
            );
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    // TODO add button functionality to add a task
    render() {
        return (

            <div style={{ width: "250px", height: "500px", padding: "10px" }}>
                <h4>{this.state.name}</h4>
                <button onClick={(e) => this.deleteColumn(e)}>Delete Column</button>
                {this.state.loadedTasks ? this.renderTasks() : ''}

                <label>New Task Name:
                <input name="newTaskName" value={this.state.newTaskName}
                        onChange={e => this.handleChange(e)}></input>
                </label>
                <button type="button" onClick={(e) => this.createNewTask(e)}>Create New Task</button>
            </div>

        )
    }

};

export default Column;