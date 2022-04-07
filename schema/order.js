const mongoose=require('mongoose');
var Schema=mongoose.Schema;
var order=new Schema({
    cname:{
        type:String,
        required:true
    },
    caddress:{
        type:String,
        required:true
    },
    cemail:{
        type:String,
        required:true
    },
    ccontact:{
        type:Number,
        required:true
    },
    cpaper:{
        type:String,
        required:true
    },
    cbill:{
        type:Number,
        required:true
    },
    sdate:{
        type:Date,
        required:true
    },
    edate:{
        type:Date,
        required:true
    },
    nodays:{
        type:Number,
        required:true
    },
    vemail:{
        type:String,
        required:true
    }

})
module.exports=mongoose.model('Order',order)