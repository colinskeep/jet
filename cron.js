var orders = require('./orders.js')
var orderdetails = require('./orderdetails.js')
var acknowledge = require('./acknowledge.js')
setInterval(function () {
    orders.getorders("ready")
        .then(function (orderids) {
            for (var i in orderids) {
                var ids = orderids[i].split("/")
                getorderdetails(ids[3])
            }
        })
}, 60000);
function getorderdetails(orderid) {
    //console.log(orderid)
    orderdetails.get(orderid)
    .then( (data) =>  {
        var arr = []
            for(var i in data.order_items){
                var item = data.order_items[i].order_item_id
                var order_items = {
                    "order_item_acknowledgement_status": "fulfillable",
                    "order_item_id": "" + item + "",
                }
                arr.push(order_items)
            }
        var orderitemid = (data.order_items[0].order_item_id)
        acknowledge.put(orderid, arr)
            .then(function (data) {
                //console.log(data)
            })
        .catch(function (reason) {
            console.log(reason)
        });
    })
}