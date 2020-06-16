var mysql = require("mysql")

const ER_DUP_ENTRY = 1062

const {
    MYSQL_HOST = process.env.MYSQL_HOST,
    MYSQL_USER = process.env.MYSQL_USER,
    MYSQL_PASSWORD = process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE = process.env.MYSQL_DATABASE
} = process.env



var conn = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE
})

conn.connect(err => {
    if(err) throw err
    console.log("database connected successfully.")
})

var addUser = (name, password, callback) => {
    
    //const sql = `INSERT INTO users (name, password) VALUES ("${name}", "${password}")`
    var sql = `INSERT INTO ?? (??, ??) VALUES (?, ?);`
    var inserts = ['users', 'name', 'password', name, password]
    sql = mysql.format(sql, inserts)

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

    conn.query(sql, (error, results, fields) => {
        
        if(error) return callback({ERROR_CODE: error.code, ERROR_NO: error.errno}, null)
        if(results.length === 0) return callback({ERROR: "NO_USER_FOUND", CODE:404}, null)
        if(results.length === 1) return callback(null, results[0])
        return callback({ERROR: "UNKNOWN_ERROR", CODE:"UNKOWN"}, null)
        //console.log(results[0].name)
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





module.exports = {conn, getUser, addUser, ER_DUP_ENTRY}


