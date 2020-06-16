require("dotenv").config()
var express = require('express')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var bodyParser = require('body-parser')
var cors = require("cors")
var database = require("./serverDB")

var app = express()



app.use(cors())
app.use(express.static(__dirname + "/client"))
app.use(bodyParser.json());


var users = []



app.get('/', (req, res) => {

    res.redirect('/home')
})

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/posts', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {name: req.body.name, password: hashedPassword}
        users.push(user)
        return res.sendStatus(200)
    }
    catch{
        return res.sendStatus(500)
    }
    
    
})


app.post('/login', async (req, res) => {


    //const user = users.find(user => user.name == req.body.name)
    //if(!user) return res.sendStatus(401)
    
    try{

        //getting user from database----



        const match = await bcrypt.compare(req.body.password, user.password)
        if(!match) return res.sendStatus(403)

        const ACCESS_TOEKN = jwt.sign(user, process.env.ACCESS_TOEKN_SECRET, { expiresIn: '1h' })

        return res.json({ACCESS_TOEKN: ACCESS_TOEKN})
    }
    catch{
        return res.sendStatus(500)
    }
    
    
})


app.post('/signup', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {name: req.body.name, password: hashedPassword}
        
        //inserting data into database---------
        database.addUser(user.name, user.password, (err, result) => {
            //console.log("callback = ", result)
            if(err){
                if(result === database.ER_DUP_ENTRY) return res.status(409).send({status:"ER_DUP_ENTRY", code: database.ER_DUP_ENTRY})
            }

            if(result) return res.status(200).send({status: "success"})
            
            
        })

        //console.log("status = ", status)

        //if(status === database.ER_DUP_ENTRY) return res.status(409).send({status:"ER_DUP_ENTRY", code: ER_DUP_ENTRY})

        
    }
    catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
    
    
})

app.post('/private', authenticateUser, (req, res) => {

    console.log(req.decodedData)
    res.json(req.decodedData)
})




app.post('/signup', (req, res) => {
    console.log(req.body)
})



app.get('/login', (req, res) => {
    res.sendFile("client/login/login.html", {root: __dirname})
})

app.get('/signup', (req, res) => {
    res.sendFile("client/signup/signup.html", {root: __dirname})
})

app.get('/home', (req, res) => {
    res.sendFile("client/home/home.html", {root: __dirname})
})

app.get('/private', (req, res) => {
    console.log(__dirname)
    res.sendFile("client/private/private.html", {root: __dirname})
})



function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization
    const ACCESS_TOKEN = authHeader.split(' ')[1]

    jwt.verify(ACCESS_TOKEN, process.env.ACCESS_TOEKN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403)
        req.decodedData = decoded
    })

    next()
}






app.listen(3000)
console.log(`listening to http://localhost:3000`)