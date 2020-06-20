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

    //error handling--------
    const {name: USER_NAME, password: USER_PASSWORD} = req.body

    if(!USER_NAME || !USER_PASSWORD) return res.status(422).send({ERROR: "user name and password are requierd!"})

    if((typeof USER_NAME !== 'string') || ((typeof USER_PASSWORD !== 'string'))) return res.status(422).send({ERROR: "user name and password must be strings!"})

    //getting user from database----
    await database.getUser(USER_NAME, async (err, user) => {
        if(err) {
            if(err.CODE === 404) return res.status(404).send(err)
            return res.status(500).send(err)
        }

        //now user is found and authorizing it----
        const match = await bcrypt.compare(USER_PASSWORD, user.password)
        .catch(err => {
            return res.status(500).send({BYCRYPT_COMPARE_ERROR: err.message})
        })

        if(res.headersSent) return

        if(!match) return res.status(401).send({ERROR: "INVALID_USER_PASSWORD", CODE:401})

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

    //error handling--------
    const {name: USER_NAME, password: USER_PASSWORD} = req.body

    if(!USER_NAME || !USER_PASSWORD) return res.status(422).send({ERROR: "user name and password are requierd!"})

    if((typeof USER_NAME !== 'string') || ((typeof USER_PASSWORD !== 'string'))) return res.status(422).send({ERROR: "user name and password must be strings!"})



    //maximum 20 characters for name in database---dealing it from client side---------
    //maximum 150 characters for password in database---dealing it from client side---------

    const hashedPassword = await bcrypt.hash(USER_PASSWORD, 10)
    .catch(err => {
        return res.status(500).send({BYCRYPT_HASH_ERROR: err.message})
    })

    if(res.headersSent) return

    const user = {name: USER_NAME, password: hashedPassword}
    
    //inserting data into database---------
    database.addUser(user.name, user.password, (err, result) => {
        
        if(err){
            if(err === database.ER_DUP_ENTRY) return res.status(409).send({status:"ER_DUP_ENTRY", code: database.ER_DUP_ENTRY})
            return res.status(500).send(err)
        }

        return res.status(200).send({status: "success", code:200})
    })
        

    
    
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

    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    const status = getUrlParameter(fullUrl, 'status')

    if( status && (status.toString() === "success")) return res.sendFile("client/signup_success/signup_success.html", {root: __dirname})

    return res.sendFile("client/signup/signup.html", {root: __dirname})
})

app.get('/signup-success', (req, res) => {
    res.sendFile("client/signup_success/signup_success.html", {root: __dirname})
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


function getUrlParameter(url, parameterName) {
    const current_url = new URL(url)
    const serchParams = current_url.searchParams

    const param = serchParams.get(parameterName)
    return param
}


const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log(`listening to http://localhost:${PORT}`)