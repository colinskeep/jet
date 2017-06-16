var orders = require('./orders.js')
var orderdetails = require('./orderdetails.js')
var acknowledge = require('./acknowledge.js')
const allapitokens = require('./allapitokens.js');
const auth = require('./auth.js');
const apitoken = require('./apitoken.js');
const insertOrder =  require('./insertOrder.js')
const insertOrderItems = require('./insertOrderItems.js')


setInterval(function () {
    allapitokens.update()
   .then(function (data) {
       for (var x in data) {
           orders.getorders("ready",data[x].jetapitoken, data[x].merchant_id)
            .then(function (orderids) {
                if (orderids == "No Orders") {
                }
                else {
                    for (var i in orderids) {
                        var ids = orderids[i].split("/")
                        //console.log(data[x].merchant_id)
                        getorderdetails(orderids[i], data[x].merchant_id, data[x].jetapitoken)
                    }
                }
            })
           .catch(function (err) {
               console.log(Error(err))
           })
       }
   })
   .catch(function (err) {
        console.log(Error(err))
    })
}, 10000);


//TODO: add merchant_id to insert function

function getorderdetails(orderid, merchant_id, jetapitoken) {
    var orderid = orderid
    var merchant_ids = merchant_id
    //console.log(merchant_id)
    orderdetails.get(orderid, jetapitoken)
        .then((data) => {
            var order_id = ""
            console.log(merchant_ids)
            insertOrder.add(data.reference_order_id, merchant_ids, data.fulfillment_node, data.status, data.order_transmission_date, data.buyer.name, data.buyer.phone_number, data.shipping_to.address.address1, data.shipping_to.address.address2, data.shipping_to.address.city, data.shipping_to.address.state, data.shipping_to.address.zip_code, data.order_detail.request_shipping_carrier, data.order_detail.request_shipping_method, data.order_detail.request_ship_by, orderid)
        var arr = []
            for(var y in data.order_items){
                var item = data.order_items[y].order_item_id
                insertOrderItems.add(data.reference_order_id, data.order_items[y].merchant_sku, data.order_items[y].order_item_id, data.order_items[y].item_price.base_price, data.order_items[y].item_price.item_tax, data.order_items[y].product_title, data.order_items[y].request_order_quantity)
                var order_items = {
                    "order_item_acknowledgement_status": "fulfillable",
                    "order_item_id": "" + item + "",
                }
                arr.push(order_items)
            }
        var orderitemid = (data.order_items[0].order_item_id)
        acknowledge.put(orderid, jetapitoken, arr)
    })
    .catch(function (err) {
        console.log(Error(err))
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
            .catch(function (err) {
                console.log(Error(err))
            })
        }
    })
    .catch(function (err) {
        console.log(Error(err))
    })
}, 100000);
