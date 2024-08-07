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
      console.log('Validation errors:', errors.array()); // Log validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { address, neighborhood, city, province, workspaceType, squareFeet, leaseTerm, price, parkingGarage, publicTransport } = req.body;

    console.log('Received data:', req.body); // Log received data for debugging
    const newProperty = new Property({
      host: req.user.id,
      address,
      neighborhood,
      city,
      province,
      workspaceType,
      squareFeet,
      leaseTerm,
      price,
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

// // Fetch property by ID (authentication required)
// router.get('/:id', authMiddleware, async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);
//     if (!property) {
//       return res.status(404).json({ message: 'Property not found' });
//     }
//     res.json(property);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// Route to get all properties
router.get('/', async (req, res) => {
  try {
      const properties = await Property.find();
      res.json(properties);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
