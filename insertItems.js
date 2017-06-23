const mysql = require('mysql');

require('dotenv').config();
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

//TODO: escape all fields

exports.add = (sku, merchant_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(Error(err))
            } else {
                var querystring = `INSERT INTO jet_items (merchant_sku, merchant_id) VALUES ('${sku}', '${merchant_id}');`
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

