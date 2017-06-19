var auth = require('./auth.js')
var request = require('request')

exports.send = function (orderid, token, trackingNumber, shipDate, method, estimatedDelivery, carrier, items) {
    console.log(items)
    return new Promise(function (resolve, reject) {
        request.put({
            url: "https://merchant-api.jet.com/api/returns/" + orderid + "/complete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token + ""
            },
            body: {
                "merchant_order_id": orderid,
                "items": [
                    {
                        "order_item_id": order_item_id,
                        "total_quantity_returned": returnedQuantity,
                        "order_return_refund_qty": refundQuantity,
                        "return_refund_feedback": reason,
                        "refund_amount": {
                            "principal": refundItemAmount,
                            "tax": taxConcessions,
                            "shipping_cost": shippingConcessions,
                            "shipping_tax": 0
                        }
                    }
                ],
                "agree_to_return_charge": false
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