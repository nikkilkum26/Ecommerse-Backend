const mongoose = require('mongoose');
const {ObjectId} = require = mongoose.Schema


const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
            maxlength:32,
            required:true
        },
        description:{
            type:String,
            maxlength:2000,
            required:true
        },
        price:{
            type:Number,
            maxlength:32,
            required:true,
            trim:true
        },
        quantity:{
            type:Number,
        },
        sold:{
            type:Number,
            default:0,
        },
        category:{
            type:ObjectId,
            required:true,
            ref:'ecomCategory',
 
        },
        photo:{
            data: Buffer,
            contentType: String
        },
        shipping:{
            required: false,
            type: Boolean
        }

       
        

    },{timestamps:true}
)








mongoose.model("ecomProduct",productSchema);