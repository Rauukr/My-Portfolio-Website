const express = require('express');
const path=require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');
const mongoose = require("mongoose");

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//////-->


/////<--

app.set('view engine' , 'ejs');
app.use(express.static('public'));


app.get('/' , function(req,res){
  res.render('login');
})
app.get('/home' , isLoggedIn ,function(req,res){
  res.render('home');
})
app.get('/login' , function(req,res){
    res.render('login');
})


app.get('/signup' , function(req,res){
    res.render('signup');
})


app.post('/signup' ,async (req, res)=>{
  const data = {
    name: req.body.username,
    password: req.body.password
  }
try {
  const existingUser=await collection.findOne({name:data.name});
  if(existingUser){
    res.send("User already exists, please choose a different username");
  }else{
    const saltRounds=10;
    const hashedPassowrd= await bcrypt.hash(data.password,saltRounds);
    data.password=hashedPassowrd;
    const userdata = await collection.insertMany(data);
  console.log(userdata);
  res.status(200).send('User created successfully');
  }
} catch (error) {
  console.error(error);
  res.status(500).send('Error creating user');
}
});

app.post('/login' ,async function(req,res){
  try{
  const check=await collection.findOne({name:req.body.username});
  if(!check){
    res.send("username conaot found");
  }
  const isPasswordMatch= await bcrypt.compare(req.body.password , check.password);
  if(isPasswordMatch){
    res.render("home");
  }else{
    res.send("wrong password");
  }
  }catch{
      res.send("wrong details");
  }
})
//logout
app.get("/logout", function (req, res) {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}


const port=5000;
app.listen(port, function(){
    console.log(`server is running on port ${port}`);
})