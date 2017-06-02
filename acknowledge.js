var request = require('request');
var fs = require('fs');

exports.put = function (orderid, jetapitoken, order_items) {
    console.log(order_items)
    console.log(orderid)
    var fid = fs.readFileSync("full_id.txt").toString();
    return new Promise(function (resolve, reject) {
        request.put({
            url: "https://merchant-api.jet.com/api/orders/" + orderid + "/acknowledge",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jetapitoken + ""
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