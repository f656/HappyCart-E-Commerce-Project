const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        math:[/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    role:{
        type:String,
        required:true,
        default:'customer',
    },

},{timestamps:true});

// Hash the password before saving it to the database
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// Match User Entered Password with Hashed Password
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model("User", userSchema);