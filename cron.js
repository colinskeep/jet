var orders = require('./orders.js')
var orderdetails = require('./orderdetails.js')
var acknowledge = require('./acknowledge.js')
const allapitokens = require('./allapitokens.js');
const auth = require('./auth.js');
const apitoken = require('./apitoken.js');


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
            })
        .catch(function (reason) {
        });
    })
}

setInterval(function () {
    allapitokens.update()
    .then(function (data) {
        for (var i in data) {
            var email = data[i].email
            auth.authToken(data[i].jetapiuser, data[i].jetapisecret)
            .then((data2) => {
            apitoken.add(data2.id_token, data2.user, email)
            })
        }
    })
}, 3000);