const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const BoardSchema = new Schema(
  {
    name: String,
    columnIds: Array
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Board", BoardSchema);
