const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        //DB level validation
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(" Email is Inavlid " + value);
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
}, { runValidators: true });


const User = mongoose.model('User', userSchema);
module.exports = User;
