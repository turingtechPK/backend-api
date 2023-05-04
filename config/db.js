const mongoose = require('mongoose');
require('dotenv').config();
const { MONGO_URI } = process.env;
// Connect to the database
async function connectDb() {
    console.log(MONGO_URI);
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => console.log('MongoDB connected'))
      .catch(err => console.error(err));
}

module.exports = { connectDb };