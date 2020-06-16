var mysql = require("mysql")

const ER_DUP_ENTRY = 1062


var conn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

conn.connect(err => {
    if(err) throw err
    console.log("database connected successfully.")

})

var addUser = (name, password, callback) => {
    
    const sql = `INSERT INTO users (name, password) VALUES ("${name}", "${password}")`
    
     conn.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error)
            console.log("error.code = ", error.code)
            //ER_DUP_ENTRY code is 1062
            if(error.code === 'ER_DUP_ENTRY') return callback(ER_DUP_ENTRY, null)
            if(results) return callback(null, results)

        }

        //console.log(results)
       
    })


}


var getUser = (name, password) => {



    var sql = `SELECT * FROM ?? WHERE ??=? AND ??=?`
    var inserts = ['users', 'name', name, 'password', password]
    sql = mysql.format(sql, inserts)
    console.log(sql)

    conn.query(sql, (error, results, fields) => {
        if(error) throw error
        if(results.length === 1) console.log(results)
        //console.log(results[0].name)
    })


    
}


try{
    getUser("jake", "12345")
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


