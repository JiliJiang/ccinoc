const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const indexRouter = require('./routes/index');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ccinoc', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'NotAPasswordYou!1',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(express.json());

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Routes
app.use('/', indexRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
