const mongoose= require('mongoose');
// we use crypto to hashing the password
const crypto = require('crypto');

const uuid = require('uuid/v1');
 
const userSchema = new  mongoose.Schema({
    name:{
        type:String,
        trim:true,
        require:true,
        maxlength:32
    },
    email:{
        type:String,
        trim:true,
        require:true,
        unique:32
    },
    Hashed_password:{
        type:String,
        require:true,
    },
    about:{
        type:String,
        trim:true
    },
    salt:String,
    role:{
        type:Number,
        default:0 // 0 value for normal user and 1 for admin
    },
    history:{
        type:Array,
        default:[]
    }
},{timestamps:true}
);



// virtual field

userSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt = uuid() // uuid will generate the unique string, slat generate the hash of the unique key
    this.Hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})

userSchema.methods ={
    authenticate:function(plainText){
        return this.encryptPassword(plainText) === this.Hashed_password;
    },
    encryptPassword : function(password){
        if(!password) 
        return '';
        try{
            return crypto.createHmac('sha1',this.salt) // createHmac is a method to create hashed password
            .update(password)
            .digest('hex') 
        }catch(err){
            return err;
        }
    }
}

module.exports = mongoose.model("user",userSchema);