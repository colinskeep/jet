//insert order items into database
const mysql = require('mysql');

require('dotenv').config();
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

exports.add = (order_id, merchant_sku, order_item_id, item_price, item_tax, product_title, qty) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(Error(err))
            } else {
                var querystring = `INSERT INTO jet_order_items (order_id, merchant_sku, order_item_id, item_price, item_tax, product_title, quantity) VALUES ('${order_id}', '${merchant_sku}', '${order_item_id}', '${item_price}', '${item_tax}', '${product_title}', '${qty}');`
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

