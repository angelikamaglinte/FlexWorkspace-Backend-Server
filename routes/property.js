const express = require('express');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const Property = require('../models/Property');

const router = express.Router();

// Add new property
router.post('/', [
  authMiddleware,
  [
    check('address', 'Address is required').not().isEmpty(),
    check('neighborhood', 'Neighborhood is required').not().isEmpty(),
    check('squareFeet', 'Square Feet must be a positive integer').isInt({ min: 1 }),
  ],
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { address, neighborhood, squareFeet, parkingGarage, publicTransport } = req.body;

    const newProperty = new Property({
      host: req.user.id,
      address,
      neighborhood,
      squareFeet,
      parkingGarage,
      publicTransport,
    });

    const property = await newProperty.save();
    res.status(201).json(property); // Return the newly created property
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' }); // Return a generic server error message
  }
});

// Fetch properties by host ID
router.get('/', authMiddleware, async (req, res) => {
  try {
    const properties = await Property.find({ host: req.user.id });
    res.json(properties);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
