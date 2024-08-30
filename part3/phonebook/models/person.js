const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.log('Error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long.'],
    required: [true, 'Name is required.']
  },
  number: {
    type: String,
    minlength: [8, 'Number must be at least 8 characters long.'],
    required: [true, 'Number is required.'],
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
});


const Person = mongoose.model('Person', personSchema);

module.exports = Person;
