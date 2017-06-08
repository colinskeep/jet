//insert order into database
const mysql = require('mysql');

require('dotenv').config();
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

//TODO: escape all fields

exports.add = (order_id, merchant_id, fulfillment_node, status, order_date, buyer_name, phone_number, address1, address2, city, state, zip_code, requested_carrier, shipping_method, ship_by) => {
    name = "something's"
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(Error(err))
            } else {
                name = name.replace("'", "\\'")
                var querystring = `INSERT INTO jet_orders (order_id, merchant_id, fulfillment_node, status, order_date, buyer_name, phone_number, address1, address2, city, state, zip_code, requested_carrier, shipping_method, ship_by) VALUES ('${order_id}', '${merchant_id}', '${fulfillment_node}', '${status}', '${order_date}', '${name}', '${phone_number}', '${address1}', '${address2}', '${city}', '${state}', '${zip_code}', '${requested_carrier}', '${shipping_method}', '${ship_by}');`
                connection.query(querystring, (error, results, fields) => {
                    if (error) {
                        reject(error)
                    }
                    else {
                        resolve({ "success": "success" })
                    }
                    connection.release()
                })
            }
        })
    })
}

