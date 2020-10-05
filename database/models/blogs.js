const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  body: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  tags: [
    {
      type: String
    }
  ],
  comments: [
    {
      name: { type: String },
      email: { type: String },
      msg: { type: String }
    }
  ]
});

module.exports = model('blogs', blogSchema);
