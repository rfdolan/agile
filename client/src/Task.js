
import React, { Component } from 'react';
import axios from 'axios';

class Task extends Component {
  /*
  constructor(props) {
    super(props);
  }
  */
  // initialize our state
  state = {
    id: this.props.mongoObjectId,
    // These variables are used when putting data into the database
    messageName: null,
    messageDesc: null,
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
    this.getDataFromDb();
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

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  /*
  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    console.log("Getting data from database");
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };
  */

  // rfdolan
  // This function gets the information about our current task
  getDataFromDb = () => {
    console.log("Getting object " + this.state.id);
    axios.get('http://localhost:3001/api/getSingleTask', {
      params: {
        taskId: this.state.id
      }
    }).then((res) => {this.setState({information: res.data.taskInfo})});
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (messageName, messageDesc) => {
    // This map call makes it so that the data array in state gets filled with ids from the data object.
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    console.log("About to call putData. Name: " + messageName + " Desc: " + messageDesc);
    axios.post('http://localhost:3001/api/putData', {

      id: idToBeAdded,
      taskName: messageName,
      description: messageDesc,
    });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = (idTodelete) => {
    //parseInt(idTodelete);
    let objIdToDelete = null;
    console.log("Called delete from database");
    this.state.data.forEach((dat) => {
      if (dat.id === parseInt(idTodelete)) {
        console.log("Found item " + dat.id );
        objIdToDelete = dat._id;
      }
    });

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  //TODO fix this to work with new data schema
  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    //parseInt(idToUpdate);
    this.state.data.forEach((dat) => {
      if (dat.id === parseInt(idToUpdate)) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: { message: updateToApply },
    });
  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    //const { information } = this.state;
    return (
    
      <div>
        <h4>Task with id {this.state.id}</h4>
          {this.state.information == null
            ? 'ERROR: MALFORMED ID IN COLUMN'
            :<div style={{ padding: '10px' }} key={this.state.information.id}>
                <span style={{ color: 'gray' }}> Task Name: </span>
                {this.state.information.taskName}<br />
                <span style={{ color: 'gray' }}> Description: </span>
                {this.state.information.description}<br />
              </div>
          }
       
      </div>
    );
  }
}

export default Task;