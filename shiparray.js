var orders = require('./orders.js')
var orderdetails = require('./orderdetails.js')
var ship = require('./ship.js')

/*setInterval(function () {
    orders.getorders("ready")
        .then(function (orderids) {
            for (var i in orderids) {
                var ids = orderids[i].split("/")
                getorderdetails(ids[3])
            }
        })
}, 60000);
*/

exports.send = function getordershipmentitems(orderid) {
    return new Promise(function (resolve, reject) {
        orderdetails.get(orderid)
        .then((data) => {
            var arr = []
            for (var i in data.order_items) {
                var item = data.order_items[i].merchant_sku
                var qty = data.order_items[i].request_order_quantity
                var order_items = {
                    "merchant_sku": "" + item + "",
                    "response_shipment_sku_quantity": +qty
                }
                arr.push(order_items)
            }
            var orderitemid = (data.order_items[0].merchant_sku)
            ship.send(orderid, arr)
                .then(function (data) {
                })
            .catch(function (reason) {
                console.log(reason)
            });
        })
        resolve(orderid)
    })
}