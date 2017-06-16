//List returns from database
const mysql = require('mysql');

require('dotenv').config();
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

exports.get = (order_ids) => {
    return new Promise((resolve, reject) => {

        console.log(order_ids, "returnList.js")
        pool.getConnection((err, connection) => {
                    var querystring = `SELECT * FROM jet_orders WHERE jet_order_id IN ('${order_ids.join("','")}') ORDER BY order_date DESC;`
                    console.log(querystring)
                    connection.query(querystring, (error, results, fields) => {
                        if (error) {
                            console.log(error)
                            reject(error)
                        }
                        else {
                            console.log(results)
                            resolve(results)
                        }
                    })
                    connection.release()
                })
        })
}