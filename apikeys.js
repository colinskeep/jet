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

//TODO: add fulfillment ID into database 

exports.add = (jwttoken, apiuser, apipass, merchant_id) => {
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
                            var querystring = `UPDATE users SET jetapiuser = '${apiuser}', jetapisecret = '${apipass}', merchant_id = '${merchant_id}' WHERE email = '${data.email}';`
                            console.log(querystring)
                            connection.query(querystring, (error, results, fields) => {
                                if (error){
                                    reject(error)
                                }
                                else {
                                    resolve({"apiuser": apiuser, "apipass": apipass, "merchant_id": merchant_id, "email": data.email})
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

