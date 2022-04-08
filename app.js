//jshint esversion:6
require("dotenv").config();//level 2
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const { appendFile } = require("fs");
const mongoose=require("mongoose");
const { Db } = require("mongodb");
// var encrypt = require('mongoose-encryption');//level 2
// const md5 =require("md5");
const session=require("express-session");//level 5
const passport=require("passport");//level 5
const passportLocalMongoose=require("passport-local-mongoose");//level 5



const app=express();



app.use(express.static("public"));
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({extended:true}));


app.use(session({//level5
    secret:'salehfarrs',
    resave:false,
    saveUninitialized:false,
    cookie: { secure: false }
}));



app.use(passport.initialize());//level 5    
app.use(passport.session());//level 5


mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
// mongoose.set("useCreateIndex",true);


const userschema=new mongoose.Schema({// i added  " new mongoose.schema(..." , for level 2.
    email: String,
    password:String
});

userschema.plugin(passportLocalMongoose);


// const secret= process.env.SECRET;// level 2 , it's get a secret key that called SECRET in the .env file !

// userschema.plugin(encrypt,{secret: secret, encryptedFields:["password"]});//level 2

const User=new mongoose.model("User",userschema);

passport.use(User.createStrategy());//level 5

passport.serializeUser(User.serializeUser());//level 5
passport.deserializeUser(User.deserializeUser());//level 5


app.get("/",function(req,res){
res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
    });

    
app.get("/register",function(req,res){
    res.render("register");
    });
    app.get("/secrets",function(req,res){
        if(req.isAuthenticated()){
            res.render("secrets");
        }
        else{
            res.redirect("/login");
        }
    });
    app.get("/logout",function(req,res){//level 5
        req.logout();
        res.redirect("/");
    });
        
app.post("/register",function(req,res){
    // const newuser= new User({
    //     email: req.body.username,
    //     password: req.body.password//level 3
    // });
    // newuser.save(function(err){
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         res.render("secrets");
    //     }
    // });

    User.register({username:req.body.username},req.body.password,function(err,user){
        if(err){
            console.log("err1:"+ err);
            res.redirect("/register");
        }
        else
        {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        }
    });

});


app.post("/login",function(req,res){
// const username= req.body.username;
// const password= req.body.password;


// User.findOne({email: username},function(err,founduser){
// if(err){
//     console.log(err);
// }
// else
// {
//     if(founduser){
//         if(founduser.password == password){
//             res.render("secrets");
//         }
//     }
// }
// });

//level 5: 
const user =new User({
    username:req.body.username,
    password:req.body.password
});
req.login(user,function(err){
if(err){
    console.log("err2:"+err);

}
else
{
    passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
    });
}
});

});









app.listen("3000",function(){
console.log("the srver started port on 3000");
});