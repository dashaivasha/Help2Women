const mongoose = require("mongoose");
const express = require("express");
const objectId = require('mongodb').ObjectID;
const Schema = mongoose.Schema;

const app = express();
const jsonParser = express.json();
 
const userScheme = new Schema({login: String, pass: String, email: String, age: Number,role: String}, {versionKey: false});
const User = mongoose.model("User", userScheme);

const testScheme = new Schema({login: String, Ms: String, Children: String, Activ: String, Hobby : Array, abuse : String, Address : String, Problem: String }, {versionKey: false});
const Test = mongoose.model("Test", testScheme);

const articleScheme = new Schema({name: String, url: String, type: String}, {versionKey: false});
const Article = mongoose.model("Article",articleScheme);
 
app.use(express.static(__dirname + "/public"));

 mongoose.connect("mongodb://localhost:27017/usersdb", { useNewUrlParser: true, useFindAndModify: false }, function(err){
    if(err) return console.log(err);
    app.listen(8080, function(){
        console.log("Сервер ожидает подключения...");
    });
});
 
app.get("/api/users", function(req, res){   
    User.find({}, function(err, users){
        if(err) return console.log(err);
        res.send(users)
    });
});

app.get("/api/users/login/:login", function(req, res){
    const login = req.params.login;
    User.find({login: login}, function(err, user){
        if(err) return console.log(err);
        res.send(user);
    });
});
app.get("/api/users/email/:email", function(req, res){
    const email = req.params.email;
    User.find({email: email}, function(err, user){
        if(err) return console.log(err);
        res.send(user);
    });
});
app.get("/api/tests/email/:email", function(req, res){
    const email = req.params.email;
    Test.find({login: email}, function(err, tests){
        if(err) return console.log(err);
        res.send(tests);
    });
});
app.get("/api/users/login/:login/articles", function(req, res){
    const login = req.params.login;
    Test.find({login: login}, function(err, tests){
        if(err) return console.log(err);
        if(tests.length === 0) {
            res.send(tests);
            return;
        }
        var test = tests[0];
        var result = [];
        var types = [];
        types.push(test.Hobby);
        types.push(test.abuse);
        types.push(test.Children);
        types.push(test.Activ);
        types.push(test.Problem);
        var i = 0;
        types.forEach((hobby) => {
            Article.find({type: hobby}, function(err, articles) {
                if(articles.length !== 0) {
                    result.push({type: hobby, articles: articles});
                }
                if(++i === types.length) res.send(result);
            })
        });
    });
});

app.get("/api/articles/:id", function(req, res){
    const id = req.params.id;
    Article.findOne({_id: id}, function(err, article){
        if(err) return console.log(err);
        res.send(article);
    });
});

app.get("/api/articles/type/:type", function(req, res){
    const type = req.params.type;
    Article.find({type: type}, function(err, articles){
        if(err) return console.log(err);
        res.send(articles);
    });
});

app.get("/api/users/:id", function(req, res){
         
    const id = req.params.id;
    User.findOne({_id: id}, function(err, user){
          
        if(err) return console.log(err);
        res.send(user);
    });
});


app.get("/api/tests", function(req, res){   
    Test.find({}, function(err, test){
        if(err) return console.log(err);
        res.send(test)
    });
});

app.get("/api/tests/:id", function(req, res){
         
    const id = req.params.id;
    Test.findOne({_id: id}, function(err, test){
          
        if(err) return console.log(err);
        res.send(test);
    });
});

app.get("/api/articles", function(req, res){   
    Article.find({}, function(err, article){
        if(err) return console.log(err);
        res.send(article)
    });
});

app.get("/api/atricles/:id", function(req, res){
         
    const id = req.params.id;
    Article.findOne({_id: id}, function(err, article){
          
        if(err) return console.log(err);
        res.send(article);
    });
});

app.post("/api/users", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const userLogin = req.body.login;
    const userPass = req.body.pass;
    const userEmail = req.body.email;
    const userAge = req.body.age;
    const userRole = req.body.role;


    const user = new User({login: userLogin, pass: userPass, email: userEmail, age: userAge, role: userRole});

    user.save(function(err) {
        if (err) return console.log(err);
        res.send(user);
    });

});

app.post("/api/tests", jsonParser, function (req, res) {
       
    if(!req.body) return res.sendStatus(400);
       
    const testLogin = req.body.login;
    const testMs = req.body.Ms;
    const testChildren = req.body.Children; 
    const testActiv = req.body.Activ;
    const testHobby = req.body.Hobby;
    const testabuse = req.body.abuse;
    const testAddress = req.body.Address;
    const testProblem = req.body.Problem;
    const test = new Test({login: testLogin, Ms: testMs, Children: testChildren, Activ: testActiv,  Hobby: testHobby, abuse: testabuse, Address: testAddress, Problem: testProblem });
       
    test.save(function(err){
        if(err) return console.log(err);
        res.send(test);
    });
});
app.post("/api/articles", jsonParser, function (req, res) {
       
    if(!req.body) return res.sendStatus(400);
    const articlename = req.body.name;
    const articleurl = req.body.url;
    const articletype = req.body.type; 
    const article = new Article({name: articlename, url: articleurl, type: articletype});
       
    article.save(function(err){
        if(err) return console.log(err);
        res.send(article);

        
    });
});
    
app.delete("/api/users/:id", function(req, res){
         
    const id = req.params.id;
    User.findByIdAndDelete(id, function(err, user){
                
        if(err) return console.log(err);
        res.send(user);
    });
});

app.delete("/api/tests/:id", function(req, res){

    const id = req.params.id;
    Test.findByIdAndDelete(id, function(err, test){
        if(err) return console.log(err);
        res.send(test);
    });
});

app.delete("/api/articles/:id", function(req, res){
 
    const id = req.params.id;
    Article.findByIdAndDelete(id, function(err, article){
                
        if(err) return console.log(err);
        res.send(article);
    });
});
   

app.put("/api/users", jsonParser, function(req, res){
        
    if(!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const userLogin = req.body.login;
    const userPass = req.body.pass;
    const userEmail = req.body.email;
    const userAge = req.body.age;
    const userRole = req.body.role;
    const newUser = {login: userLogin, pass: userPass, email: userEmail,  age: userAge, role: userRole};
       

    User.findOneAndUpdate({_id: id}, newUser, {new: true}, function(err, user){
         if(err) return console.log(err); 
        res.send(user);
    });
});

   
app.put("/api/articles", jsonParser, function(req, res){
        
    if(!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const articlename = req.body.name;
    const articleurl = req.body.url;
    const articletype = req.body.type; 
    const article = {name: articlename, url: articleurl, type: articletype};
       

    Article.findOneAndUpdate({_id: id}, article, {new: true}, function(err, article){
         if(err) return console.log(err); 
        res.send(article);
    });
});
    

app.put("/api/tests", jsonParser, function(req, res){
        
    if(!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const testLogin = req.body.login;
    const testMs = req.body.Ms;
    const testChildren = req.body.Children; 
    const testActiv = req.body.Activ;
    const testHobby = req.body.Hobby;
    const testabuse = req.body.abuse;
    const testAddress = req.body.Address;
    const testProblem = req.body.Problem;
    const test = {login: testLogin, Ms: testMs, Children: testChildren, Activ: testActiv,  Hobby: testHobby, abuse: testabuse, Address: testAddress, Problem: testProblem };
    Test.findOneAndUpdate({_id: id}, test, {new: true}, function(err, test){
         if(err) return console.log(err); 
        res.send(test);
    });
});


  // (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});
