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

exports.query = (email, password) => {
    email = email.toLowerCase()
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(Error(err))
            } else {
                var querystring = `SELECT email FROM users where email = '${email}' AND pass = '${password}';`
                connection.query(querystring, (error, results, fields) => {
                    console.log(results)
                    if (results.length > 0) {
                        if (results[0].email = email) {
                            var tokenobj = {
                                email: email,
                                password: password
                            }
                            token.make(tokenobj)
                                .then((data) => {
                                    resolve({
                                        'login': true,
                                        'jwttoken': data
                                    })
                                })
                        }
                        else {
                        }                       
                    } else {
                        console.log("failed")
                        resolve({ login: false })
                    }
                    connection.release()
                })
            }
        })
    })
};
