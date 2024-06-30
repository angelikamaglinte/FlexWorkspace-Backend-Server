const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Import route files
const propertyRoutes = require('./routes/property'); // Path to the route file

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (optional, if you serve frontend files from the server)
app.use(express.static(path.join(__dirname, 'public')));

// Register the routes
app.use('/api/properties', propertyRoutes); // Use the property routes

// Example route for static file serving (optional)
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// // server.js

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();
// const path = require('path'); // Import the path module

// const app = express();

// // Middleware
// app.use(cors({ origin: '*' }));
// app.use(bodyParser.json());

// // Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI);

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/property', require('./routes/property'));

// // Use auth.js middleware for /api/auth routes
// app.use('/api/auth', require('./middleware/auth'));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


// // const express = require('express');
// // const mongoose = require('mongoose');
// // const bodyParser = require('body-parser');
// // const cors = require('cors');
// // require('dotenv').config();
// // const path = require('path'); // Import the path module

// // const app = express();

// // // Middleware
// // app.use(cors({ origin: '*' }));
// // app.use(bodyParser.json());

// // // Serve static files from the "public" directory
// // app.use(express.static(path.join(__dirname, 'public')));

// // // Connect to MongoDB
// // // mongoose.connect(process.env.MONGODB_URI, {
// // //   useNewUrlParser: true,
// // //   useUnifiedTopology: true,
// // // });
// // mongoose.connect(process.env.MONGODB_URI);


// // // Routes
// // app.use('/api/auth', require('./routes/auth'));
// // app.use('/api/property', require('./routes/property'));

// // const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => console.log(`Server started on port ${PORT}`));