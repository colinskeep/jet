var auth = require('./auth.js');
var request = require('request');
var fs = require('fs')


exports.put = function (orderid, order_items) {
    console.log(order_items)
    console.log(orderid)
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
                "order_items": order_items    
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