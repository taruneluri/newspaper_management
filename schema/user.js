const mongoose=require('mongoose');
var Schema=mongoose.Schema;
const user=new Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String
    },
    location:{
        type:String,
        required:true
    },
    mobileno:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model('User',user);