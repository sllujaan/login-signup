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


const {
    ACCESS_TOEKN_SECRET = process.env.ACCESS_TOEKN_SECRET
} = process.env




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

    //getting user from database----
    await database.getUser(req.body.name, async (err, user) => {
        if(err) {
            if(err.CODE === 404) return res.status(404).send(err)
            return res.status(500).send(err)
        }

        //now user is found and authorizing it----
        const match = await bcrypt.compare(req.body.password, user.password)
        .catch(err => {
            return res.status(500).send({BYCRYPT_COMPARE_ERROR: err.message})
        })

        if(res.headersSent) return

        if(!match) return res.status(403).send({ERROR: "INVALID_USER_PASSWORD", CODE:403})

        var ACCESS_TOEKN = null

        try{
            ACCESS_TOEKN = jwt.sign({id:user.id, name:user.name}, ACCESS_TOEKN_SECRET, { expiresIn: '1h' })
        }
        catch(err) {
            return res.status(500).send({JWT_SIGN_ERROR: err.message})
        }

        return res.json({ACCESS_TOEKN: ACCESS_TOEKN})
            

    })
    
    
})


app.post('/signup', async (req, res) => {
    //maximum 20 characters for name in database---dealing it from client side---------
    //maximum 150 characters for password in database---dealing it from client side---------
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {name: req.body.name, password: hashedPassword}
        
        //inserting data into database---------
        database.addUser(user.name, user.password, (err, result) => {

            if(err){
                if(err === database.ER_DUP_ENTRY) return res.status(409).send({status:"ER_DUP_ENTRY", code: database.ER_DUP_ENTRY})
                return res.status(500).send(err)
            }

            return res.status(200).send({status: "success", code:200})
        })
        
    }
    catch(err){
        console.log(err)
        return res.status(500).send({ERROR: "INTERNAL_SERVER_ERROR", CODE:500})
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

    jwt.verify(ACCESS_TOKEN, ACCESS_TOEKN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403)
        req.decodedData = decoded
    })

    next()
}





app.listen(3000)
console.log(`listening to http://localhost:3000`)