const mongoos = require('mongoose')
const bcrypt=require('bcrypt')



const userSchema= new mongoos.Schema({
    firstname:{
        type:String,require:true
    },
    lastname:{
        type:String,require:true
    },
    email:{
        type:String,unique:true,require:true
    },
    password:{
        type:String,require:true
    },
    conpassword:{
        type:String,require:true
    }
})
// userSchema.pre("save",function(next){
//     if(!this.isModified("password"))
//         return next();
//     this.password=bcrypt.hashSync(this.password,10);
//     next();    
// });
// //compare password
// userSchema.methods.comparePassword=function(plainText,callback){
//     return callback(null,bcrypt.compareSync(plainText,this.password))
// }
exports.signUpDB=mongoos.model('user',userSchema);

//session_user
// const sessionSchema=new mongoos.Schema({
//     session_username:String,
//     hash:String,
//     salt:String,
// });
// module.exports = mongoos.model('session', sessionSchema);