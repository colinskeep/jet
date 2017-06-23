var id = require('./itemDetails.js');
var request = require('request');

exports.send = function (sku, jwttoken, product_title, pack_quantity, brand, image_url, upc_code, product_description, manufacturer, manufacturers_part_number, bullet1, bullet2, bullet3, bullet4, bullet5, shipping_weight) {
    return new Promise(function (resolve, reject) {
        request.put({
            url: "https://merchant-api.jet.com/api/merchant-skus/" + sku + "",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwttoken + ""
            },
            body: {
                product_title: product_title,
                multipack_quantity: pack_quantity,
                brand: brand,
                main_image_url: image_url,
                standard_product_codes: [
                    {
                        standard_product_code: upc_code,
                        standard_product_code_type: "UPC"
                    }
                ],
                product_description: product_description,
                manufacturer: manufacturer,
                mfr_part_number: manufacturers_part_number,
                bullets: [
                    bullet1,
                    bullet2,
                    bullet3,
                    bullet4,
                    bullet5
                ],
                shipping_weight_pounds: shipping_weight,
            },
            json: true
        },
            function (error, response, body) {
                if (error) {
                    reject(error)
                }
                else {
                    resolve("sent")
                }
            }
        );
    })
}