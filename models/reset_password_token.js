const mongoose = require('mongoose');
const user = require('./users');

const resetSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:user
    },
    email:{
        type:String
    },
    accessToken:{
        type:String
    },
    isValid:{
        type:Boolean
    }
},{
    timestamps:true
});

const PasswordToken=mongoose.model('PasswordToken',resetSchema);
module.exports=PasswordToken;