var express = require("express");
var bodyParser = require("body-parser");

var app = express()


app.use(bodyParser.json());


app.post('/login', (req, res) => {
    console.log(req.body)
    res.sendStatus(200)
})

app.get('/login', (req, res) => {
    res.sendFile("client/login/login.html", {root: __dirname})
})

app.get('/signup', (req, res) => {
    res.sendFile("client/signup/signup.html", {root: __dirname})
})


app.get('/', (req, res) => {
    res.redirect('/home')
})

app.get('/home', (req, res) => {
    res.sendFile("client/home/home.html", {root: __dirname})
})

app.get('/private', (req, res) => {
    console.log(__dirname)
    res.sendFile("client/private/private.html", {root: __dirname})
})


app.listen(3000)
console.log(`app is listening to port http://localhost:3000/`)