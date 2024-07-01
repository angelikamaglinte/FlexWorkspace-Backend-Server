const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  workspaceType: {
    type: String,
    required: true
  },
  squareFeet: {
    type: Number,
    required: true,
  },
  parkingGarage: {
    type: Boolean,
    default: false,
  },
  publicTransport: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Property', PropertySchema);