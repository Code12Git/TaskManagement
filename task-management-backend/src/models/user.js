const  mongoose  = require('mongoose');

const {Schema } = mongoose

const userSchema = new Schema({
    name:{
        type:String,
        trim:true
    },
    username:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true
    },
    role:{
        type:String,
        enum:['manager','user','admin'],
        default:'user'
    },
    password:{
        type:String,
        trim:true
    }
},{timestamps:true})

module.exports = mongoose.model('User',userSchema)