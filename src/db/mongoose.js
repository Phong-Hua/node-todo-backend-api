const mongoose = require('mongoose')
const uri = process.env.MONGODB_URL

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const connection = mongoose.connection

connection.once("open", function() {
    console.log("MongoDB database connection established successfully");
  });