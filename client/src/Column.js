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
    console.log("Updating " + fieldToUpdate + " to be " + updateToApply);
    //parseInt(idToUpdate);

    axios.post('http://localhost:3001/api/updateData', {
      id: this.state.id,
      update: { [fieldToUpdate]: updateToApply },
    });
  };

  // TODO Fix problem where this doesn't update
  renderName = (propName, propContent) =>{
    
    return<div> 
        <EditableElement 
        elementType="h3"
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
        }).then((res) => { this.setState({ taskIds: res.data.objectInfo.taskIds, information: res.data.objectInfo }) });
    };

    // TODO add button functionality to add a task
    render() {
        return (
            <div style={{ display: "inline-block", border: "5px solid red", padding: "5px", margin: "5px" }}>
                {this.state.information == null 
                    ? 'ERROR: MALFORMED ID IN BOARD'
                    :<div> 
                        {this.renderName("name", this.state.information.name)}
                        {this.renderTasks()}
                        <button>Add task</button>
                    </div>
                }

            </div>
        )
    }

};

export default Column;