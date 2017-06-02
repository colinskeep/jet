const mysql = require('mysql');

require('dotenv').config();
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

exports.update = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(Error(err))
            } else {
                var querystring = `SELECT email, jetapiuser, jetapisecret, jetapitoken FROM users WHERE CHAR_LENGTH(jetapiuser) = 40 AND CHAR_LENGTH(jetapisecret) = 44 ;`
                connection.query(querystring, (error, results, fields) => {
                    if (error) {
                        reject(Error(error))
                    } else {
                        resolve(results)
                    }
                })
            }
            connection.release();
        })
        })
    }

            
        
