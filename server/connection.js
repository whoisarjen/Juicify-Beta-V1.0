const mongoose = require('mongoose');

    //  ES6 Promises
    mongoose.Promise = global.Promise;

    // Connect to mongodb
    console.log(`Need mongoDB's string`)
    mongoose.connect('', { useNewUrlParser: true, useUnifiedTopology: true });
    
    mongoose.connection.once('open', function(){
        console.log("Connection with mongoDB has been made!");
    }).on('error', function(err){
        console.log("Connection with mongoDB ended with error!");
        console.log(err);
    });

module.exports = mongoose