const mysql = require('mysql');
const validate = require('./validate.js');


require('dotenv').config();
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

exports.query = (jwttoken, orderid) => {
    var orderids = orderid
    var arr = []

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            console.log(jwttoken, orderid)
            validate.get(jwttoken)
                .then((data) => {
                    if (err) {
                        reject(Error(err))
                    } else {
                        var querystring = `SELECT * FROM jet_order_items RIGHT JOIN jet_orders on jet_order_items.order_id = jet_orders.order_id WHERE jet_order_items.order_id = '${orderids}' and jet_orders.merchant_id = '${data[0].merchant_id}';`
                        connection.query(querystring, (error, results, fields) => {
                            if (error) {
                                console.log(error)
                                reject(error)
                            }
                            else {
                                for (i in results) {
                                    arr.push(results[i])
                                    if (arr.length >= results.length)
                                    {
                                        resolve(arr)
                                    }
                                }
                                }
                            })
                    }            
                })    
        connection.release()
        })
    })
}
