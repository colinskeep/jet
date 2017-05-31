//insert authtoken into db
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const token = require('./token.js');

require('dotenv').config();
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

exports.add = (jetapitoken, apiuser, email) => {
    //console.log(jetapitoken, apiuser, email)
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(Error(err))
            } else {
                var querystring = `UPDATE users SET jetapitoken = '${jetapitoken}' WHERE jetapiuser = '${apiuser}' AND email = '${email}';`
                connection.query(querystring, (error, results, fields) => {
                    if (error) {
                        reject(error)
                                }
                    else {
                         resolve({"success": "success"})
                            }
                        connection.release()
                    })       
            }
        })
    })
}

