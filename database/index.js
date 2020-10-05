/* eslint-disable no-console */
const mongoose = require('mongoose')

const db = process.env.MONGO_URI;

module.exports = mongoose.connect(db,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('MongoDB Created successfully');
  });
