const mysql = require('mysql');

require('dotenv').config();
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

exports.get = (jwttoken) => {
    return new Promise((resolve, reject) => {
        console.log(jwttoken[0].merchant_id)
        pool.getConnection((err, connection) => {
                    var querystring = `SELECT * FROM jet_items WHERE merchant_id = '${jwttoken[0].merchant_id}'  ORDER BY merchant_sku DESC;`
                    connection.query(querystring, (error, results, fields) => {
                        console.log(querystring)
                        if (error) {
                            console.log(error)
                            reject(error)
                        }
                        else {
                            resolve(results)
                        }
                    })
                    connection.release()
                })
        })
}
