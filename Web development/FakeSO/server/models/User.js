const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    username:{
        type : String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    reputation: {
        type: Number,
        default: 0, 
    },
})
const user = mongoose.model('user', UserSchema);
user.createIndexes();
module.exports = user;