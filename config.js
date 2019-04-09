//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection

var mongoDB = 'mongodb+srv://grounding:pwadmin2019@grounding-926u7.mongodb.net/Grounding';
mongoose.connect(mongoDB, { useNewUrlParser: true }, (err) => {
    if (err)
        console.log(err);
    else
        console.log('database connected');
});
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;