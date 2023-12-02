const mongoose= require('mongoose');


const connect = mongoose.connect("mongodb://localhost:27017/logindata")

connect.then(()=>{
    console.log("mongodb connected successfully");
})
.catch(()=>{
    console.log("mongodb can't connected");
})

//create a schema
const LoginSchema= new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   password:{
    type: String,
    required:true
   }
})

//collection model

const collection = new mongoose.model("users" , LoginSchema);

module.exports=collection;