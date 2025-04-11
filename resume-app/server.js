require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const mqConsumer = require('./mqConsumer');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the views directory (e.g., HTML files)
app.use(express.static('views'));

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Root route redirects to /login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Route handlers
app.use('/', authRoutes);
app.use('/resume', resumeRoutes);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  mqConsumer();
});
