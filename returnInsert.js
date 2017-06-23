const mysql = require('mysql');

require('dotenv').config();
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

//TODO: escape all fields

exports.get = (return_id, order_id) => {
    var return_ids = return_id
    var order_ids = order_id
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(Error(err))
            } else {
                var querystring = `UPDATE jet_orders set return_id = '${return_ids}' WHERE jet_order_id = '${order_ids}';`
                connection.query(querystring, (error, results, fields) => {
                    console.log(querystring)
                    if (error) {
                        reject(error)
                    }
                    else {
                        console.log(order_ids)
                        resolve(order_ids)
                    }
                    connection.release()
                })
            }
        })
    })
}

