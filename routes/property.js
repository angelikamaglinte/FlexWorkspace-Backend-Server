const express = require('express');
const { check, validationResult } = require('express-validator');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  [
    authMiddleware,
    [
      check('address', 'Address is required').not().isEmpty(),
      check('neighborhood', 'Neighborhood is required').not().isEmpty(),
      check('squareFeet', 'Square feet is required').isNumeric(),
      check('parkingGarage', 'Parking garage must be a boolean').isBoolean(),
      check('publicTransport', 'Public transport must be a boolean').isBoolean(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { address, neighborhood, squareFeet, parkingGarage, publicTransport } = req.body;

    try {
      const newProperty = new Property({
        host: req.user.id,
        address,
        neighborhood,
        squareFeet,
        parkingGarage,
        publicTransport,
      });

      const property = await newProperty.save();
      res.json(property);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;