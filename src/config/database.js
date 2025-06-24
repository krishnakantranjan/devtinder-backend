const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        'mongodb+srv://krishnakantranjan50:2NIeuWBbNfyTKIxD@krishnacluster.owtuulo.mongodb.net/DevTinder'
    );
};


module.exports = connectDB;

