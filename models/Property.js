const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  neighborhood: {
    type: String,
    required: true
  },
  squareFeet: {
    type: Number,
    required: true
  },
  parkingGarage: {
    type: Boolean,
    default: false
  },
  publicTransport: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);