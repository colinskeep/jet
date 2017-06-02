var orders = require('./orders.js')
var orderdetails = require('./orderdetails.js')
var acknowledge = require('./acknowledge.js')
const allapitokens = require('./allapitokens.js');
const auth = require('./auth.js');
const apitoken = require('./apitoken.js');


setInterval(function () {
    allapitokens.update()
   .then(function (data) {
       for (var x in data) {
           orders.getorders("ready",data[x].jetapitoken)
            .then(function (orderids) {
                if (orderids == "No Orders") {
                }
                else {
                    for (var i in orderids) {
                        var ids = orderids[i].split("/")
                        getorderdetails(orderids[i], data[x].jetapitoken)
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
}, 100000);

function getorderdetails(orderid, jetapitoken) {
    orderdetails.get(orderid, jetapitoken)
    .then((data) =>  {
        var arr = []
            for(var y in data.order_items){
                var item = data.order_items[y].order_item_id
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
