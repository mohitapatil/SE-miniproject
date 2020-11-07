const express= require('express')
const mongoose= require('mongoose')
const mongodb = require('mongodb')
const hospital= require('./modules/hospital')
const question= require('./modules/questions')
const answers= require('./modules/answers')
const passport     = require("passport");
const LocalStratergy=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");
const methodOverride= require("method-override");


var bodyParesr   = require("body-parser");
// const answers = require('./modules/answers')

const app= express()
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/SE-miniproject', {
useNewUrlParser: true,
useCreateIndex: true,
useUnifiedTopology: true 
})
app.use(bodyParesr.urlencoded({extended: true}))
mongoose.set('useFindAndModify', false);
app.set("view engine", "ejs");
app.use(express.static(__dirname ));

app.use(require("express-session")({
	secret : "once again!!",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(hospital.authenticate()));
passport.serializeUser(hospital.serializeUser());
passport.deserializeUser(hospital.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

//hospital list
app.get('/', (req, res) => {
    hospital.find({},function(err,allhospitals){
        if(err){
            console.log(err);
        }else{
            res.render("index.ejs",{hospital:allhospitals})
        }
    });
});

app.get('/hi',(req,res)=>{
    res.render("hi.ejs")
})

//hospital registration
app.get('/register', (req, res) => {
   res.render('register.ejs');
})

//post hospital registration
app.post("/register", function(req, res){
    var newHospital = new hospital({ username: req.body.username,totalBeds: req.body.totalBeds})
        hospital.register(newHospital, req.body.password, (err,hospital)=>{
        if(err){
            console.log(err)
            return res.render("hi.ejs")
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/")
            // res.redirect("/:id",{hospital: hospital.id})
        })
    })
    });

//show login form
app.get("/login",function(req,res){
	res.render("login.ejs");
});

//router.use(hospitalRoutes);
app.post("/login",passport.authenticate("local",
				{
					// successRedirect: "/products",
					failureRedirect: "/login"
}), function(req,res,next){
		res.redirect("/")
});

app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/");
});

//Show individual hospital details
app.get("/hospital/:id",function(req,res){
	// //FIND product with required id
    // Product.findById(id,callback)
    //console.log(req.local.currentUser)
	hospital.findById(req.params.id, function(err,hospital){
		if(err){
			console.log(err);
		}else{
			res.render("show.ejs",{hospital});
		}
	});

});

//Update hospital details
app.get("/hospital/:id/edit",isLoggedIn, function(req,res){
    hospital.findById(req.params.id,(err, hospital)=>{
        res.render("hospitalUpdate.ejs",{hospital: hospital})
    })
})

//post updates of hospital
app.post("/hospital/:id",function(req,res){
	//find and update correct products
	hospital.findByIdAndUpdate(req.params.id,req.body.hospital,function(err,updatedProduct){
		if(err){
			res.redirect("/");
		}else{
			res.redirect("/hospital/" + req.params.id);
		}
	});
});



//get question list
app.get('/question', (req, res) => {
    question.find({},(error,allquestions)=>{
        if(error){
            console.log(error)
        } else {
            res.render('questions.ejs',{question: allquestions});
        }
    })
    })
    
//add new question in tahe list
app.post("/question", function(req, res){
    var text= req.body.text
    var newQuestion = { text: text}
    question.create(newQuestion, function(error,newquestion){
        if(error){
            console.log(error)
        } else{
            res.redirect("/question"); 
        }
    })
    });

//show individual questions with their answers
app.get("/question/:id",function(req,res){
	question.findById(req.params.id).populate('answers').exec(function(err,question){
		if(err){
			console.log(err);
		}else{
			res.render("showQuestions.ejs",{question: question});
		}
	});

});

//add answer
app.get("/question/:id/answers/new",isLoggedIn,function(req,res){
	//find product by id
	question.findById(req.params.id,function(err,question){
		if(err){
			console.log(err);
		}else{
			res.render("newAnswer.ejs",{question: question});
		}
	});
	//res.render("comments/new");
});
//post added answer
app.post("/question/:id/answers",function(req,res){
	//lookup products using id
	question.findById(req.params.id,function(err,question){
		if(err){
			console.log(err);
			res.redirect("/question");	
		}else{
            const newAnswer = new answers({text: req.body.text})
		answers.create( newAnswer,function(err,answer){
			if(err){
				console.log(err);
			}else {
                //add username and id to comment
                
				// console.log(req.user.username);
				answer.author.id = req.user._id;
				answer.author.hospital = req.user.username;
				//save comment
				answer.save();
				question.answers.push(answer);
				question.save();
				console.log(answer);
				/////
				res.redirect("/question/" + question._id); 
				/////
			}
		});
		}
	});
	//create new comments
	//connect new comment to product
	//redirect product show page
});

app.get('/question/:id/answers/:comment_id/upvot', function(req,res,next){

    answers.findByIdAndUpdate(req.params.comment_id,{'$inc':{upvote: 1}},{new: true}).exec((err, updatedvalue)=>{
        if(err){
            res.redirect("back")
        }else{
            res.redirect("back")
        }
    })
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

// function checkHospitalOwnership(req,res,next){
// 	if(req.isAuthenticated()){
// 	 	hospital.findById(req.params.id,function(err,foundHospital){
// 		if(err){
//             console.log(err)
// 			res.redirect("back");
// 		}else{
// 				//if admin
// 			if(req.params.id === req.body.hospital.id){
// 			next();
// 			}
// 			else{
// 				res.redirect("/");			}
// 		}
// 	});
// 	}
// 		//else redirect
// 	else{
// 		res.redirect("back");
// 	}
// }

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
    })