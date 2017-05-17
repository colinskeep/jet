var auth = require('./auth.js');
var request = require('request');
var fs = require('fs');


exports.put = function (orderid, itemid) {
    var global_data = fs.readFileSync("auth.txt").toString();
    var fid = fs.readFileSync("full_id.txt").toString();
    return new Promise(function (resolve, reject) {
        request.put({
            url: "https://merchant-api.jet.com/api/orders/" + orderid + "/acknowledge",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + global_data + ""
            },
            body: {
                "acknowledgement_status": "accepted",
                "order_items": [
                    {
                        "order_item_acknowledgement_status": "fulfillable",
                        "order_item_id": ""+ itemid +"",
                    }
                ]
            },
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