const mysql = require('mysql');

require('dotenv').config();
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

exports.query = (orderid) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(Error(err))
            } else {
                var querystring = `SELECT merchant_sku, quantity FROM jet_order_items WHERE order_id = '${orderid}';`
                connection.query(querystring, (error, results, fields) => {
                    var arr = []
                    for (i in results) {
                        var item = results[i].merchant_sku
                        var quantity = results[i].quantity
                        var order_items = {
                            "merchant_sku": "" + item + "",
                            "response_shipment_sku_quantity": +quantity
                        }
                        arr.push(order_items)
                    }
                    resolve(arr)
                })
            }
                connection.release()
                })
            })
        }
