const express= require('express')
const mongoose= require('mongoose')
const mongodb = require('mongodb')
const hospital= require('./modules/hospital')
const question= require('./modules/questions')
const answers= require('./modules/answers')

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

app.set("view engine", "ejs");
app.use(express.static(__dirname ));

app.get('/', (req, res) => {
    hospital.find({},function(err,allhospitals){
        if(err){
            console.log(err);
        }else{
            res.render("index.ejs",{hospitals:allhospitals})
        }
    });
});

//hospital registration
app.get('/register', (req, res) => {
   res.render('register.ejs');
})
//post hospital registration
app.post("/register", function(req, res){
    var name= req.body.name
    var password= req.body.password
    var totalBeds= req.body.totalBeds;
    var newHospital = { name: name, password: password, totalBeds: totalBeds}
    hospital.create(newHospital, function(error,newhospital){
        if(error){
            console.log(error)
        } else{
            res.redirect("/"); 
        }
    })
    });

//Show individual hospital details
app.get("/:id",function(req,res){
	// //FIND product with required id
	// Product.findById(id,callback)
	hospital.findById(req.params.id, function(err,selected){
		if(err){
			console.log(err);
		}else{
			res.render("show.ejs",{hospital: selected});
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

// //add answer
// app.get("/question/:id/answers/new",function(req,res){
// 	//find product by id
// 	question.findById(req.params.id,function(err,question){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.render("answer/new",{question: question});
// 		}
// 	});
// 	//res.render("comments/new");
// });
// //post added answer
// app.post("/question/:id/answers",function(req,res){
// 	//lookup products using id
// 	question.findById(req.params.id,function(err,question){
// 		if(err){
// 			console.log(err);
// 			res.redirect("/question");	
// 		}else{
// 		answers.create(req.body.answer,function(err,answer){
// 			if(err){
// 				console.log(err);
// 			}else {
//                 //add username and id to comment
                
// 				// console.log(req.user.username);
// 				answer.author.id = req.user._id;
// 				answer.author.name = req.user.name;
// 				//save comment
// 				comment.save();
// 				question.answers.push(answer);
// 				question.save();
// 				console.log(answer);
// 				/////
// 				res.redirect("/question/" + question._id); 
// 				/////
// 			}
// 		});
// 		}
// 	});
// 	//create new comments
// 	//connect new comment to product
// 	//redirect product show page
// });

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
    })