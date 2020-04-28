const mongoose= require('mongoose');
let Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const ProductSchema = new  mongoose.Schema({
    name:{
        type:String,
        trim:true,
        require:true,
        maxlength:32
    },
    description:{
        type:String,
        trim:true,
        require:true,
        maxlength:2000
    },
    price:{
        type:String,
        trim:true,
        require:true,
        maxlength:32
    },
    category:{
        type: ObjectId ,
        ref:'category',
        require:true
    },
    quantity:{
        type:Number,
    },
    sold:{
        type:Number,
        default:0
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    shipping:{
        required:false,
        type:Boolean
    }

},
    {timestamps:true}
);

module.exports = mongoose.model("Product",ProductSchema);




