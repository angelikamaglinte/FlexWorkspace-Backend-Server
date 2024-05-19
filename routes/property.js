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
    check('squareFeet', 'Square Feet is required').isInt({ min: 1 }),
  ],
], async (req, res) => {
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
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Fetch properties by host ID
router.get('/', authMiddleware, async (req, res) => {
  try {
    const properties = await Property.find({ host: req.user.id });
    res.json(properties);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;