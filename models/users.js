const mongoose = require('mongoose')

const users = new mongoose.Schema({
    email: {
        type: String,
        required: true
    } , 
    password: {
        type: String, 
        required: true
    }
})

users.pre('find', (next) => {
    console.log("In users Model");
    next()
})

module.exports = mongoose.model('users', users)
