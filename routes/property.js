const express = require('express');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const Property = require('../models/Property');

const router = express.Router();

module.exports = (upload) => {
  // Add new property with image upload
  router.post('/', upload.single('image'), [
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

      const { address, neighborhood, city, province, workspaceType, squareFeet, leaseTerm, price, parkingGarage, publicTransport } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : '';

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
        image,
      });

      const property = await newProperty.save();
      res.status(201).json(property);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server Error' });
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

  // Route to get all properties
  router.get('/all', async (req, res) => {
    try {
      const properties = await Property.find();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  return router;
};

// // Add new property
// router.post('/', [
//   authMiddleware,
//   [
//     check('address', 'Address is required').not().isEmpty(),
//     check('neighborhood', 'Neighborhood is required').not().isEmpty(),
//     check('squareFeet', 'Square Feet must be a positive integer').isInt({ min: 1 }),
//   ],
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { address, neighborhood, city, province, workspaceType, squareFeet, leaseTerm, price, parkingGarage, publicTransport } = req.body;

//     const newProperty = new Property({
//       host: req.user.id,
//       address,
//       neighborhood,
//       city,
//       province,
//       workspaceType,
//       squareFeet,
//       leaseTerm,
//       price,
//       parkingGarage,
//       publicTransport,
//     });

//     const property = await newProperty.save();
//     res.status(201).json(property); // Return the newly created property
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server Error' }); // Return a generic server error message
//   }
// });

// // Fetch properties by host ID
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     const properties = await Property.find({ host: req.user.id });
//     res.json(properties);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// // // Fetch property by ID (authentication required)
// // router.get('/:id', authMiddleware, async (req, res) => {
// //   try {
// //     const property = await Property.findById(req.params.id);
// //     if (!property) {
// //       return res.status(404).json({ message: 'Property not found' });
// //     }
// //     res.json(property);
// //   } catch (error) {
// //     console.error(error.message);
// //     res.status(500).json({ message: 'Server Error' });
// //   }
// // });

// // Route to get all properties
// router.get('/', async (req, res) => {
//   try {
//       const properties = await Property.find();
//       res.json(properties);
//   } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

module.exports = router;
