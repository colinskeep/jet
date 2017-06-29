var auth = require('./auth.js')
var request = require('request')

exports.send = function (return_id, orderid, token, items) {
    var returnids = return_id
    var orderids = orderid
    var tokens = token

    //TODO: expected logic flaw if customer returns 2 of the same order_item_id and only receives refund on 1
    var arr = []
    for (i in items) {
        var returned_quantity = parseFloat(items[i].returned_quantity)
        var refund_quantity = parseFloat(items[i].refund_quantity)
        var tax_concessions = parseFloat(items[i].tax_concessions)
        var shipping_concessions = parseFloat(items[i].shipping_concessions)
        arr.push({
            "order_item_id": items[i].order_item_id,
            "total_quantity_returned": returned_quantity,
            "order_return_refund_qty": returned_quantity,
            "return_refund_feedback": items[i].return_refund_feedback,
            "refund_amount": {
                "principal": refund_quantity,
                "tax": tax_concessions,
                "shipping_cost": shipping_concessions,
                "shipping_tax": 0
            }
            })
    }
    console.log(arr)
    return new Promise(function (resolve, reject) {
        request.put({
            url: "https://merchant-api.jet.com/api/returns/" + returnids + "/complete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + tokens + ""
            },
            body: {
                "merchant_order_id": orderids,
                "items":
                    arr,
                "agree_to_return_charge": true
            },
            json: true
        },
            
            function (error, response, body) {
                if (error) {
                    resolve(error)
                }
                else {
                    resolve(response)
                }
            })
    })
}