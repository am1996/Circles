const mongoose = require('mongoose');

const connect = async (cs) => {
  try {
    await mongoose.connect(cs, {
    });
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit on connection failure
  }
};

module.exports = connect;