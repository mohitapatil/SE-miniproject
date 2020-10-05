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

app.get('/register', (req, res) => {
   res.render('register.ejs');
})

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

app.get('/question', (req, res) => {
    question.find({},(error,allquestions)=>{
        if(error){
            console.log(error)
        } else {
            res.render('questions.ejs',{question: allquestions});
        }
    })
    })
    
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

//Show individual product details
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

app.get("/question/:id",function(req,res){
	question.findById(req.params.id).populate('answers').exec(function(err,question){
		if(err){
			console.log(err);
		}else{
			res.render("showQuestions.ejs",{question: question});
		}
	});

});


app.listen(3000, () => {
    console.log('Server is up on port 3000.')
    })