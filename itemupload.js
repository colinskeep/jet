var auth = require('./auth.js');
var id = require('./itemDetails.js');
var sku = require('./sku.js');
var request = require('request');
var fs = require('fs');

exports.send = function (itemid, itemdetails) {
    var global_data = fs.readFileSync("auth.txt").toString();
    var itemid = sku.itemid();
    var itemdetails = id.itemdetails();
    return new Promise(function (resolve, reject) {
        request.put({
            url: "https://merchant-api.jet.com/api/merchant-skus/" + itemid.sku + "",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + global_data + ""
            },
            body: itemdetails,
            json: true
        },
            function (error, response, body) {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(true)
                }
            }
        );
    })
}