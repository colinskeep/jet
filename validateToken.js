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


exports.check = (jwttoken) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            token.read(jwttoken)
                .then(function (data) {
                    //console.log(data)
                    var querystring = `SELECT jetapitoken FROM users WHERE email = '${data.email}';`
                    connection.query(querystring, (error, results, fields) => {
                        if (error) {
                            console.log(error)
                            reject({ jwt: false })
                        }
                        else {
                            //console.log(results)
                            resolve({ jwt: true })
                        }
                    })
                })
            connection.release()
        })
    })
}