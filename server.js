// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); // Import the path module

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// // Serve static files from the "uploads" directory for uploaded files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/property', require('./routes/property'));
app.use('/api/properties', require('./routes/properties'))

// Use auth.js middleware for /api/auth routes
app.use('/api/auth', require('./middleware/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


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
// // mongoose.connect(process.env.MONGODB_URI, {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // });
// mongoose.connect(process.env.MONGODB_URI);


// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/property', require('./routes/property'));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));