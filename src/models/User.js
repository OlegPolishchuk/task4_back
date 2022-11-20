const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      required: true,
    },
    created: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
)

module.exports = mongoose.model('User', UserSchema);