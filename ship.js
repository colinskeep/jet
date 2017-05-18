var auth = require('./auth.js')
var request = require('request')
var fs = require('fs')

exports.send = function (orderid, order_items) {
    var global_data = fs.readFileSync("auth.txt").toString();
    //console.log(order_items)
    return new Promise(function (resolve, reject) {
        request.put({
            url: "https://merchant-api.jet.com/api/orders/" + orderid + "/shipped",
            //url: "http://requestb.in/qd57srqd",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + global_data + ""
            },
            body: {
                "shipments": [
                    {
                  
                      "shipment_tracking_number": "1Z12342452342",
                      "response_shipment_date": "2017-05-17T18:00:00.0000000-04:00",
                      "response_shipment_method": "ups_ground",
                      "expected_delivery_date": "2017-05-20T18:00:00.0000000-04:00",
                      "ship_from_zip_code": "12061",
                      "carrier_pick_up_date": "2017-05-17T18:00:00.0000000-04:00",
                      "carrier": "UPS",
                      "shipment_items": 
                            order_items
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
            })
    })
}