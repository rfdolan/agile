import React, { Component } from 'react';
import Board from "./Board.js";
//import axios from 'axios';

class App extends Component {
  // initialize our state
  state = {
    data: [],
    id: 0,
    messageName: null,
    messageDesc: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };

  /*
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

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    console.log("Getting data from database");
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
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

    console.log("About to call putData. Name: " + messageName + "Desc: " + messageDesc);
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
    const { data } = this.state;
    return (
      <div>
        <ul>
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
                <li style={{ padding: '10px' }} key={data.message}>
                  <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                  <span style={{ color: 'gray' }}> Task Name: </span>
                  {dat.taskName}<br />
                  <span style={{ color: 'gray' }}> Description: </span>
                  {dat.description}<br />
                </li>
              ))}
        </ul>
        <div style={{ border: '3px solid black', padding: '10px'}}>
         <b>Add an element!</b> 
        <div style={{ padding: '10px' }}>
          <body>Task Name:</body>
          <input
            type="text"
            onChange={(e) => this.setState({ messageName: e.target.value })}
            placeholder="enter taskname"
            style={{ width: '200px' }}
          />
          <br />
          <body>Description:</body>
          <input
            type="text"
            onChange={(e) => this.setState({ messageDesc: e.target.value })}
            placeholder="enter description"
            style={{ width: '200px' }}
          />
          <button onClick={() => this.putDataToDB(this.state.messageName, this.state.messageDesc)}>
            ADD
          </button>
        </div>
        </div><br />
        <div style={{ border: '3px solid black', padding: '10px'}}>
          <b>Delete an element!</b>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
        </div>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ idToUpdate: e.target.value })}
            placeholder="id of item to update here"
          />
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of the item here"
          />
          <button
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
          </button>
        </div>
      </div>
    );
  }
  */
 render() {
   return(
     <div>
       <h1>Welcome to the app this text is from the App component</h1>
       <Board id={"5da66b5c1c9d440000565d7f"} />

     </div>
   )
 }
}

export default App;