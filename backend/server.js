var express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
const API_PORT = 3001;
app.use(cors());
const router = express.Router();
var sql = require("mysql");

var pool = sql.createPool({
    connectionLimit: 10,
    user: 'root',
    password: 'raymond',
    host: 'localhost',
    database: 'agile'
});
/*
// GET METHODS
// rfdolan
// This method takes an object id and returns the specific object we want
router.get('/getTask', (req, res) => {
  let id = req.query.objId;
  //console.log("Id is " + id);
  Task.findById(id, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, objectInfo: data });
  });
});
*/

/*
* GET BOARD
* Takes a board id
* Returns the columns of the board
*/
router.post('/getBoard', (req, res) => {
  // Connect to the database
  pool.getConnection((err, connection) => {
    if(err) {console.log(err);}
    // Query
    //console.log(req.query)
    connection.query("SELECT * FROM boards WHERE board_id = ?",[
      req.query.id
    ], (err, result) => {
      if(err) throw(err);
      //console.log(result);
      if(result.length === 0) return res.json({ success: false, statusCode: 400 });
      return res.json({ success: true, statusCode: 200, board: result[0] });
    })
  })
});

router.post('/createBoard', (req, res) => {
  // Connect to the database
  pool.getConnection((err, connection) => {
    if(err) {console.log(err);}
    // Query
    //console.log(req.query)
    connection.query("INSERT INTO boards (name) VALUES (?)",[
      req.query.name
    ], (err, result) => {
      if(err) throw(err);
      //console.log(result);
      return res.json({ success: true, statusCode: 200 });
    })
  })
});


// append /api for our http requests
// This makes it so that we can use router instead of app in this file, so everything in here is part of the API
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

/*
LEGACY FOR MONGODB
const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const Task = require('./task');
const Column = require('./column');
const Board = require('./board');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute =
  'mongodb+srv://rfdolan:ReallyGoodVerySecurePassword@cluster0-jpq6i.mongodb.net/test?retryWrites=true&w=majority';

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// GET METHODS
// rfdolan
// This method takes an object id and returns the specific object we want
router.get('/getTask', (req, res) => {
  let id = req.query.objId;
  //console.log("Id is " + id);
  Task.findById(id, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, objectInfo: data });
  });
});

router.get('/getColumn', (req, res) => {
  let id = req.query.objId;
  //console.log("Id is " + id);
  Column.findById(id, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, objectInfo: data });
  });
});

router.get('/getBoard', (req, res) => {
  let name = req.query.name;
  //console.log("Id is " + id);
  Board.findOne({ "name": name}, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, objectInfo: data });
  });
});

// UPDATE METHODS
// this is our update method
// this method overwrites existing data in our database
router.post('/updateTask', (req, res) => {
  const { id, update } = req.body;
  console.log("CALLING UPDATE on " + id);
  console.log(update);
  Task.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post('/updateColumn', (req, res) => {
  const { id, update } = req.body;
  console.log("CALLING UPDATE on " + id);
  console.log(update);
  Column.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post('/updateBoard', (req, res) => {
  const { id, update } = req.body;
  console.log("CALLING UPDATE on " + id);
  console.log(update);
  Board.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// CREATE METHODS
// this is our create methid
// this method adds new data in our database
router.post('/putEmptyTask', (req, res) => {
  console.log("Starting putData");
  let task = new Task();

 
  task.description = "description";
  task.taskName = "name";
  task.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, objectInfo: task });
  });
});

router.post('/putEmptyColumn', (req, res) => {
  console.log("Calling putEmptyColumn");
  let column = new Column();

  column.name = "New Column";
  column.taskIds = [];
  column.save((err) => {
    if(err) return res.json({ success: false, error: err });
    return res.json({ success: true, objectInfo: column });
  });

});

router.post('/putEmptyBoard', (req, res) => {
  console.log("Calling putEmptyColumn");
  let board = new Board();

  board.name = "New Column";
  board.taskIds = [];
  board.save((err) => {
    if(err) return res.json({ success: false, error: err });
    return res.json({ success: true, objectInfo: board });
  });

});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

router.post('/deleteColumn', (req, res) => {
  console.log("In delete function");
  const {id} = req.body;
  Column.findByIdAndRemove(id, (err) => {
    if(err) return res.send(err);
    return res.json({success:true});
  });
});



// append /api for our http requests
// This makes it so that we can use router instead of app in this file, so everything in here is part of the API
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
*/