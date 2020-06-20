var mysql = require("mysql")

const ER_DUP_ENTRY = 1062

const {
    MYSQL_HOST = process.env.MYSQL_HOST,
    MYSQL_USER = process.env.MYSQL_USER,
    MYSQL_PASSWORD = process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE = process.env.MYSQL_DATABASE
} = process.env


console.log("MYSQL_HOST = ", MYSQL_HOST)


var conn = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE
})

conn.on('error', (err) => {
    console.log("database error>>>>>>>>>>>")
    console.log(err)
})

conn.connect(err => {
    if(err) {
        console.log("database connection failed.")
        console.log({ERROR_CODE: err.code, ERROR_NO: err.errno})
        return
    }

    console.log("database connected successfully.", "status: ", conn.state)
})

var addUser = async (name, password, callback) => {
    
    //const sql = `INSERT INTO users (name, password) VALUES ("${name}", "${password}")`
    var sql = `INSERT INTO ?? (??, ??) VALUES (?, ?);`
    var inserts = ['users', 'name', 'password', name, password]
    sql = mysql.format(sql, inserts)


    console.log(conn.state)


    //resolving db connection issues while the server is running--------------------------------
    var connectionResponse = await handleConnection()
    .catch(err => {
        console.log("handleConnection err = ", err)
        return callback(err, null)
    })

    if(connectionResponse.state) console.log("connectionResponse = ", connectionResponse.state)

    if(conn.state === 'disconnected') {console.log("server was still disconnected."); return}

    //------------------------------------------------------------------------------------------

    console.log(sql)
     conn.query(sql, (error, results, fields) => {
        if(error) {
            //console.log(error)
            //console.log("error.code = ", error.code)
            //ER_DUP_ENTRY code is 1062
            if(error.code === 'ER_DUP_ENTRY') return callback(ER_DUP_ENTRY, null)
            return callback({ERROR_CODE: error.code, ERROR_NO: error.errno}, null)
        }

        return callback(null, results)
       
    })
}


var getUser = async (name, callback) => {

    if(!callback) throw Error('callback is required.')
    if(typeof callback !== 'function') throw Error('callback must be a function.')

    var sql = `SELECT * FROM ?? WHERE ??=?;`
    var inserts = ['users', 'name', name]
    sql = mysql.format(sql, inserts)

    //resolving db connection issues while the server is running--------------------------------
    var connectionResponse = await handleConnection()
    .catch(err => {
        console.log("handleConnection err = ", err)
        return callback(err, null)
    })

    if(connectionResponse && connectionResponse.state) console.log("connectionResponse = ", connectionResponse.state)

    if(conn.state === 'disconnected') {console.log("server was still disconnected."); return}

    //------------------------------------------------------------------------------------------

    console.log(sql)
    conn.query(sql, (error, results, fields) => {
        
        if(error) return callback({ERROR_CODE: error.code, ERROR_NO: error.errno}, null)
        if(results.length === 0) return callback({ERROR: "NO_USER_FOUND", CODE:404}, null)
        if(results.length === 1) return callback(null, results[0])
        return callback({ERROR: "UNKNOWN_ERROR", CODE:"UNKOWN"}, null)
        //console.log(results[0].name)
    })
}



async function handleConnection() {
    console.log("handleConnection status = ", conn.state)


    return new Promise((resolve, reject) => {

        if(conn.state === 'disconnected') {
        
            conn = mysql.createConnection({
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASSWORD,
                database: MYSQL_DATABASE
            })
    
            conn.connect(err => {
                if(err) {
                    //console.log("database connection failed.")
                    //console.log({ERROR_CODE: err.code, ERROR_NO: err.errno})
                    return reject({ERROR: "DATABASE CONNECTION FAILURE", ERROR_CODE: err.code})
                    //return callback({ERROR: "DATABASE CONNECTION FAILURE", ERROR_CODE: err.code}, null)
                }
    
                console.log("database connected successfully.", "status: ", conn.state)
                
                conn.on('error', (err) => {
                    console.log("database error>>>>>>>>>>>")
                    console.log(err)
                })
                
                return resolve({status: "server connected.", state: conn.state})
    
    
            })
        }
        else{
            return resolve({status: "server was already connected.", state: conn.state})
        }

        

    })
    


    
}


try{
    getUser("jake", (err, data) => {
        if(err) console.log(err)
        if(data) console.log(data)
    })
}
catch(err) {
    console.log(err)
}

/*
try{
    addUser("jake", "12345")
}
catch(err) {
    console.log(err)
}

*/


function sum(a, b) {
    return a + b;
  }



module.exports = {conn, getUser, addUser, ER_DUP_ENTRY, sum}


