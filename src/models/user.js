const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
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
        unique: true, // it also create index
        lowercase: true,
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
        min: 1,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
}, { runValidators: true },
);


userSchema.methods.getJWT = async function () {
    // DON'T USE ARROW FUNCTION OTHERWISE IT WILL BREAK
    const user = this;
    const token = jwt.sign({ _id: user._id }, "Dev@Tinder$2204121", {expiresIn : "7d"});
    return token;
}
const User = mongoose.model('User', userSchema);
module.exports = User;
