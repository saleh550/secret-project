//jshint esversion:6
require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const { appendFile } = require("fs");
const mongoose=require("mongoose");
const { Db } = require("mongodb");
var encrypt = require('mongoose-encryption');//level 2

const app=express();



app.use(express.static("public"));
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});


const userschema=new mongoose.Schema({// i added  " new mongoose.schema(..." , for level 2.
    email: String,
    password:String
});

const secret= process.env.SECRET;// level 2 , it's get a secret key that called SECRET in the .env file !

userschema.plugin(encrypt,{secret: secret, encryptedFields:["password"]});//level 2

const User=new mongoose.model("User",userschema);


app.get("/",function(req,res){
res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
    });

    
app.get("/register",function(req,res){
    res.render("register");
    });
        
app.post("/register",function(req,res){
    const newuser= new User({
        email: req.body.username,
        password: req.body.password
    });
    newuser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });

});


app.post("/login",function(req,res){
const username= req.body.username;
const password= req.body.password;


User.findOne({email: username},function(err,founduser){
if(err){
    console.log(err);
}
else
{
    if(founduser){
        if(founduser.password == password){
            res.render("secrets");
        }
    }
}
});

});









app.listen("3000",function(){
console.log("the srver started port on 3000");
});