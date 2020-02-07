import React, { Component } from 'react';
import Task from "./Task.js";
import EditableElement from "./EditableElement";
import axios from 'axios';

class Column extends Component {
    state = {
        id: this.props.id,
        information: null,
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
        for (let i = 0; i < this.state.taskIds.length; i++) {
            tasks.push(<><Task mongoObjectId={this.state.taskIds[i]} /><br /></>);
        }
        return tasks;
    }

    getColumnFromDb = () => {
        //console.log("Getting Column " + this.state.id);
        axios.get('http://localhost:3001/api/getColumn', {
            params: {
                objId: this.state.id
            }
        }).then((res) => { this.setState({ taskIds: res.data.objectInfo.taskIds, information: res.data.objectInfo }) });
    };

    putNewTaskToDb = () => {
        //console.log("Putting new column");
        axios.post('http://localhost:3001/api/putEmptyTask')
            .then((res) => {
                console.log(res);
                this.addTaskToColumn(res.data.objectInfo._id)
            });
    };

    addTaskToColumn = (newTaskId) => {
        console.log(newTaskId);

        axios.post('http://localhost:3001/api/updateColumn', {
            id: this.state.id,
            update: { $push: { taskIds: newTaskId } },

        });

    };

    deleteColumnFromDb = () => {
        console.log("deleting column " + this.state.id);
        axios.post('http://localhost:3001/api/deleteColumn', {
            id: this.state.id,
            
        }).then((res) => {console.log(res)} )
    }

    // TODO add button functionality to add a task
    render() {
        return (
            
            <div style={{ width:"250px", height:"500px", padding:"10px"}}>
                <button onClick={this.deleteColumnFromDb}>Delete Column</button>
                {this.state.information == null
                    ? 'ERROR: MALFORMED ID IN BOARD'
                    : <div>
                        {this.renderName("name", this.state.information.name)}
                        {this.renderTasks()}
                        <button onClick={this.putNewTaskToDb}>Add task</button>
                    </div>
                }

            </div>
        )
    }

};

export default Column;