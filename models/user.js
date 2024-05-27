const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Schema to create User model
const userSchema = new Schema({
    username: {
      type: String,
      required: true,
      trim: true
    },
    
    
    password: {
      type: String,
      required: true,
      
    },
    
  });

  // hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});


userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

// Initialize our User model
const User = model('user', userSchema);

module.exports = User;