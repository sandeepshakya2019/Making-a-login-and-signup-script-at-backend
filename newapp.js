//jshint esversion:6

//Setup the server

// dotenv for environment variable
require('dotenv').config();
//fot this first make the .env file add the secrets variables lik api_keys
//require the npm packages express,mongoose,bodyparser,ejs
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
//using the hashing techniques
//const md5 = require('md5');
//using the bcrypt technique
//const bcrypt = require('bcrypt');
//using the salt rounds
//const saltRounds = 10;
//const encrypt = require('mongoose-encryption');
//requiring the session variable packages
const session = require('express-session');
const passport = require('passport')
//using the passport local mongoose it automatically genrated the password in hash and salts
const passportLocalMongoose = require('passport-local-mongoose')

//definning the app instance
const app = express();
//setting the view engine ejs (templating engine) (in view files)
app.set("view engine",'ejs');
// use the body parser for the post request
app.use(bodyParser.urlencoded({extended:true}));
//used to store the static files (html,css,js) (public directory)
app.use(express.static("public"));
// we tell our app to use session package with some initial conditions
app.use(session({
	secret: "our little secret by sandeep shakya",
	resave: false,
  	saveUninitialized: false
}));
// we tell our app to use passport to initialize package
app.use(passport.initialize());
// we tell our app to use passport to manage our session
app.use(passport.session());



//setup the MongoDB
mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true,useUnifiedTopology: true } );
mongoose.set('useCreateIndex', true);
//making the schema
const userSchema = new mongoose.Schema ({
	email: String,
	password: String
});
// adding the passportlocalmongoose as plugin
userSchema.plugin(passportLocalMongoose);
//database encryption
//userSchema.plugin(encrypt, { secret: process.env.SECRET;,  encryptedFields: ['Password']});
//defining a model
const User =new mongoose.model("User",userSchema);
//just copy paste form local-mongoose
passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
	res.render("home");
});
app.get("/register",function(req,res){
	res.render("register");
});
app.post("/register",function(req,res){
	User.register({username:req.body.username},req.body.password, function(err,user){
		if (err){
			console.log(err);
			res.redirect("/register")
		}else{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/secrets");
			});
		}
	})
	
});
app.get("/login",function(req,res){
	res.render("login");
});
app.post("/login",function(req,res){
	const user = new User({
		username:req.body.username,
		password:req.body.password
	});
	// using the login method to from passport
	req.login(user ,function(err){
		if (err){
			console.log(err);
			res.redirect("/login")
		}else{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/secrets");
			});
		}
	})
	
});
app.get("/secrets",function(req,res){
	if (req.isAuthenticated()){
		res.render("secrets");
	}else{
		res.redirect("/login");
	}
});
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
})
//to listen at port 3000
app.listen(3000,function(){
	console.log("Running at Port 3000");
})