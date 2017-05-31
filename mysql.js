const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const token = require('./token.js');


require('dotenv').config();
var pool = mysql.createPool({
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
});

exports.query = (password, email) => {
    email = email.toLowerCase()
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(Error(err))
            } else {
                var querystring = `SELECT IF(COUNT(*) > 0, 'FAILED', 'OK') AS Status FROM users WHERE email = '${email}';`
                connection.query(querystring, (error, results, fields) => {
                    if (results[0].Status == 'OK') {
                        var querystring2 = `INSERT INTO users (pass, email) VALUES ('${password}','${email}');`
                        connection.query(querystring2, (error, results, fields) => {
                            var tokenobj = {
                                email: email,
                                password: password
                            }
                            token.make(tokenobj)
                            .then((data) => {
                                resolve({'jwttoken' : data})
                            })
                            })
                        } else {
                        console.log("failed")
                        resolve({error: "Email Already Exists"})
                    }
                    connection.release()
                })
            }
        })
    })
};
