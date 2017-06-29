const mysql = require('mysql');

require('dotenv').config();
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

//TODO: escape all fields

exports.add = (sku, merchant_id, product_title, pack_quantity, brand, image_url, upc_code, product_description, manufacturer, manufacturers_part_number, bullet1, bullet2, bullet3, bullet4, bullet5, shipping_weight) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(Error(err))
            } else {
                var querystring = `INSERT INTO jet_items (merchant_sku, merchant_id, product_title, pack_quantity, brand, image_url, upc_code, product_description, manufacturer, manufacturers_part_number, bullet1, bullet2, bullet3, bullet4, bullet5, shipping_weight) VALUES ('${sku}', '${merchant_id}' , '${product_title}', '${pack_quantity}', '${brand}', '${image_url}', '${upc_code}', '${product_description}', '${manufacturer}', '${manufacturers_part_number}', '${bullet1}', '${bullet2}', '${bullet3}', '${bullet4}', '${bullet5}', '${shipping_weight}');`
                console.log(querystring)
                connection.query(querystring, (error, results, body) => {
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
