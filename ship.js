var auth = require('./auth.js')
var request = require('request')

exports.send = function (orderid, token, trackingNumber, shipDate, method, estimatedDelivery, carrier, items) {
    console.log(items)
    return new Promise(function (resolve, reject) {
        request.put({
            url: "https://merchant-api.jet.com/api/orders/" + orderid + "/shipped",
            //url: "http://requestb.in/qd57srqd",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token + ""
            },
            body: {
                "shipments": [
                    {
                  
                      "shipment_tracking_number": trackingNumber,
                      "response_shipment_date": shipDate + "T18:00:00.0000000-04:00",
                      "response_shipment_method": method,
                      "expected_delivery_date": estimatedDelivery + "T18:00:00.0000000-04:00",
                      //"ship_from_zip_code": "12061",
                      //"carrier_pick_up_date": "2017-05-17T18:00:00.0000000-04:00",
                      "carrier": carrier,
                      "shipment_items": 
                            items
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
                    resolve(response)
                }
            })
    })
}