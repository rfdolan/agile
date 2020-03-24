
import React, { Component } from 'react';
import axios from 'axios';
import EditableElement from './EditableElement.js';
import base_url from './api'

const delete_url = base_url + 'deleteTask'
class Task extends Component {
  /*
  constructor(props) {
    super(props);
  }
  */
  // initialize our state
  state = {
    id: this.props.id,
    // These variables are used when putting data into the database
    name: this.props.name,
    description: this.props.description,
    intervalIsSet: false,

    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    // Information is the json that holds all of the task's information
    information: null,
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
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

  deleteTask = (e) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      let taskId = encodeURIComponent(this.state.id)
      fetch(delete_url + `?id=${taskId}`, {
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
              console.log("Error deleting task")
            }
          }
        );
    }
  }

  // our update method that uses our backend api
  // to overwrite existing data base information
  //TODO rewrite
  updateDB = (fieldToUpdate, updateToApply) => {
    console.log("Updating " + fieldToUpdate + " to be " + updateToApply);
    //parseInt(idToUpdate);

    axios.post('http://localhost:3001/api/updateTask', {
      id: this.state.id,
      update: { [fieldToUpdate]: updateToApply },
    });
  };

  renderProperty = (propName, propContent, labelText) => {

    return <div>
      <span style={{ color: 'gray' }}>{labelText}: </span>
      <EditableElement
        elementType="span"
        content={propContent}
        updateProp={this.updateDB}
        fieldName={propName}
      />
    </div>
  }

  render() {
    //const { information } = this.state;
    return (

      <div style={{ border: "3px solid black" }}>
        <button type="button" onClick={(e) => this.deleteTask(e)}>Delete</button>
        <div>
          {this.renderProperty("taskName", this.state.name, "Task Name")}
          {this.renderProperty("description", this.state.description, "Description")}
        </div>

      </div>
    );
  }
}

export default Task;