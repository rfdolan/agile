const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const ColumnSchema = new Schema(
  {
    name: String,
    taskIds: Array
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Column", ColumnSchema);