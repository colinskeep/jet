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

exports.add = (jwttoken, apiuser, apipass) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(Error(err))
            } else {
                var querystring = `SELECT IF(COUNT(*) > 0, 'FAILED', 'OK') AS Status FROM users WHERE jetapiuser = '${apiuser}';`
                connection.query(querystring, (error, results, fields) => {
                    if (results[0].Status == 'OK') {
                        token.read(jwttoken)
                        .then(function (data) {
                            var querystring = `UPDATE users SET jetapiuser = '${apiuser}', jetapisecret = '${apipass}' WHERE email = '${data.email}';`
                            connection.query(querystring, (error, results, fields) => {
                                if (error){
                                    reject(error)
                                }
                                else {
                                    resolve({"apiuser": apiuser, "apipass": apipass})
                                } 
                            })
                        })
                    }
                    else {
                        console.log("failed")
                        resolve({error: "Store Already Exists"})
                    }
                    connection.release()                        
                })     
            }
        })
    })
}

