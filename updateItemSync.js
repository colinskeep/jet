//arr[x].product_title, arr[x].pack_quantity, arr[x].brand, arr[x].image_url, arr[x].upc_code, arr[x].product_description, arr[x].manufacturer, arr[x].manufacturers_part_number, arr[x].bullet[1], arr[x].bullet[2], arr[x].bullet[3], arr[x].bullet[4], arr[x].bullet[5], arr[x].shipping_weight, arr[x].merchant_id, arr[x].merchant_sku

const mysql = require('mysql');

require('dotenv').config();
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

//TODO: escape all fields

exports.get = (product_title, pack_quantity, brand, image_url, upc_code, product_description, manufacturer, manufacturers_part_number, bullet1, bullet2, bullet3, bullet4, bullet5, shipping_weight, merchant_id, merchant_sku) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(Error(err))
            } else {
                var querystring = `UPDATE jet_items SET product_title = '${product_title}', pack_quantity = '${pack_quantity}', brand = '${brand}', image_url = '${image_url}', upc_code = '${upc_code}', product_description = '${product_description}', manufacturer = '${manufacturer}', manufacturers_part_number = '${manufacturers_part_number}', bullet1 = '${bullet1}', bullet2 = '${bullet2}', bullet3 = '${bullet3}', bullet4 = '${bullet4}', bullet5 = '${bullet5}', shipping_weight = '${shipping_weight}' WHERE merchant_id = '${merchant_id}' AND merchant_sku = '${merchant_sku}';`
                connection.query(querystring, (error, results, fields) => {
                    console.log(querystring)
                    if (error) {
                        reject(error)
                    }
                    else {
                        resolve({ "data": true })
                    }
                    connection.release()
                })
            }
        })
    })
}
