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
const bcrypt = require('bcrypt');
//using the salt rounds
const saltRounds = 10;
//const encrypt = require('mongoose-encryption');


//setup the MongoDB
mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true,useUnifiedTopology: true } );
const userSchema = new mongoose.Schema ({
	email: String,
	password: String
});

//database encryption
//userSchema.plugin(encrypt, { secret: process.env.SECRET;,  encryptedFields: ['Password']});
//defining a model
const User =new mongoose.model("User",userSchema);
//definning the app instance
const app = express();
//setting the view engine ejs (templating engine) (in view files)
app.set("view engine",'ejs');
// use the body parser for the post request
app.use(bodyParser.urlencoded({extended:true}));
//used to store the static files (html,css,js) (public directory)
app.use(express.static("public"));

app.get("/",function(req,res){
	res.render("home");
})
app.get("/login",function(req,res){
	res.render("login");
})
app.post("/login",function(req,res){
	const username= req.body.username
	//const password= md5(req.body.password)
	const password= req.body.password
	
	User.findOne({email:username},function(err,foundUser){
		if(err){
			console.log(err)
		}else{
			if (foundUser){
				bcrypt.compare(password, foundUser.password, function(err, result){
    			// result == true
    			if (result === true){
    				res.render("secrets");
    			}
			});
			

			}
					
				
			
		}
		
	});
});

app.get("/register",function(req,res){
	res.render("register");
})
app.post("/register",function(req,res){
	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    	// Store hash in your password DB.
    	const newUser = new User({
		email: req.body.username,
		password: hash
		//Password: md5(req.body.password)
		})
		newUser.save(function(err){
			if(!err){
				res.render("secrets");
			}else{
				console.log(err);
			}
		});

	});
	
})

//to listen at port 3000
app.listen(3000,function(){
	console.log("Running at Port 3000");
})