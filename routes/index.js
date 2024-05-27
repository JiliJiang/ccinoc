const express = require('express');
const router = express.Router();
const Record = require('../models/record');
const User = require('../models/user') // Ensure this path is correct



// Home page
router.get('/', (req, res) => {
  res.render('login');
});

router.get('/index', (req, res) => {
  res.render('index');
});

// Search functionality
router.get('/search', async (req, res) => {
  const keyword = req.query.keyword;
  try {
    const results = await Record.find({
      stringFields: { $regex: keyword, $options: 'i' }
    });
    
    req.session.searchResultsUrl = req.originalUrl; // Save the search URL to session
    res.render('results', { results });
  } catch (err) {
    console.error('Error searching data:', err);
    res.status(500).send('Error searching data');
  }
});

// Edit record page
router.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const record = await Record.findById(id);
    res.render('edit', { record });
  } catch (err) {
    console.error('Error retrieving record:', err);
    res.status(500).send('Error retrieving record');
  }
});

// Handle record update
router.post('/edit/:id', async (req, res) => {
  const id = req.params.id;
  const { stringFields, linkFields, linkLabels, imageFields } = req.body;

  const updatedFields = {
    stringFields: Array.isArray(stringFields) ? stringFields.filter(Boolean) : [],
    linkFields: Array.isArray(linkFields) && Array.isArray(linkLabels) ?
                linkFields.map((url, index) => ({ url, label: linkLabels[index] })).filter(link => link.url && link.label) : [],
    imageFields: Array.isArray(imageFields) ? imageFields.filter(Boolean) : []
  };

  try {
    await Record.findByIdAndUpdate(id, updatedFields, { new: true });
    const redirectUrl = req.session.searchResultsUrl || '/';
    res.redirect(redirectUrl); // Redirect back to the search results page or home if no search
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).send('Error saving data');
  }
});

// Handle new record submission
router.post('/submit', async (req, res) => {
  const { stringFields, linkFields, linkLabels, imageFields } = req.body;

  const newRecord = new Record({
    stringFields: Array.isArray(stringFields) ? stringFields.filter(Boolean) : [],
    linkFields: Array.isArray(linkFields) && Array.isArray(linkLabels) ?
                linkFields.map((url, index) => ({ url, label: linkLabels[index] })).filter(link => link.url && link.label) : [],
    imageFields: Array.isArray(imageFields) ? imageFields.filter(Boolean) : []
  });

  try {
    await newRecord.save();
    res.redirect('/'); // Redirect to home after successful submission
  } catch (err) {
    console.error('Error saving new record:', err);
    res.status(500).send('Error saving new record');
  }
});



router.delete('/edit/:id', async (req, res) => {
  console.log(req.params.id)
  try {
    const results = await Record.findOneAndDelete({
      _id: req.params.id,
    });

    if(!results){
      return
    }
    res.json({message:"success"})
    
  } catch (err) {
    console.error('Error searching data:', err);
    res.status(500).send('Error searching data');
  }
});


router.post('/api/users', async function(req, res) {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  });
  res.json(user);
})

router.get('/api/users', async function(req, res) {
  const users = await User.find({});
  res.json(users);
})

router.post('/api/users/login', async (req, res) =>{
console.log(req.body);
const user = await User.findOne(
  {username: req.body.username}
);
const validPassword = await user.isCorrectPassword(req.body.password);
if (!validPassword) {
  res
    .status(400)
    .json({ message: 'Incorrect username or password. Please try again!' });
  return;
}
req.session.save(() => {
  req.session.loggedIn = true;
  res
    .status(200)
    .json({ user: user, message: 'You are now logged in!' });
});
})





module.exports = router;
