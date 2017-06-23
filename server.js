var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
var auth = require('./auth.js')
var upload = require('./itemupload.js')
var updateinv = require('./updateInventory.js')
var updateprice = require('./updatePrice.js')
var active = require('./active.js')
var orders = require('./orders.js')
var orderdetails = require('./orderdetails.js')
var acknowledge = require('./acknowledge.js')
var cron = require('./cron.js')
var shiparray = require('./shiparray.js')
var numberOfOrders = require('./numberOfOrders.js')
var numberOfItems = require('./numberOfItems.js')
var numberOfReturns = require('./numberOfReturns.js')
var items = require('./items.js')
var itemdetails = require('./itemDetails.js')
var mysql = require('./mysql.js')
var apikeys = require('./apikeys.js')
var apitoken = require('./apitoken.js')
var cookieToToken = require('./cookieToToken.js')
var orderList = require('./orderList.js')
var ship = require('./ship.js')
var orderItems = require('./orderItems.js')
var login = require('./login.js')
var validateToken = require('./validate.js')
var returnList = require('./returnList.js')
var returns = require('./returns.js')
var returnDetails = require('./returnDetails.js')
var getOrderItems = require('./getOrderItems.js')
var getOrderDetails = require('./getOrderDetails.js')
var insertItems = require('./insertItems.js')
var updateOrder = require('./updateOrder.js')
var itemList = require('./itemList.js')
var syncItemList = require('./syncItemList.js')
var rma = require('./rma.js')
var returnInsert = require('./returnInsert.js')
var updateItemSync = require('./updateItemSync.js')

app.get('/', function (req, res) {
  res.send({
     "data":"dick"
    })
})


//TODO: get authtoken and insert into database after user / pass are submitted
app.post('/register', function (req, res) {
    console.log(req.body.password, req.body.email)
	mysql.query(req.body.password, req.body.email)
	.then(function(data) {
        res.send(data)
	})
.catch(function (error) {
        console.log(error)
    })
})

app.put('/add-inventory/', function (req, res) {
    cookieToToken.get(req.query.jwttoken)
        .then(function (token) {
            upload.send(req.query.sku, token, body.product_title, body.pack_quantity, body.brand, body.image_url, body.upc_code, body.product_description, body.manufacturer, body.manufacturers_part_number, body.bullet1, body.bullet2, body.bullet3, body.bullet4, body.bullet5, body.shipping_weight)
        })
        .then(function (merchant_id) {
            validateToken.get(req.query.jwttoken)
            return merchant_id
        })
        .then(function (insert) {
            return insertItems.add(req.query.sku, merchant_id, req.body.product_title, req.body.pack_quantity, req.body.brand, req.body.image_url, req.body.upc_code, req.body.product_description, req.body.manufacturer, req.body.manufacturers_part_number, req.body.bullet1, req.body.bullet2, req.body.bullet3, req.body.bullet4, req.body.bullet5, req.body.shipping_weight)
        })
        .then(function (data) {
            res.send({ upload: "sent" })
        })
})

app.get('/inventory', function (req, res) {
    validateToken.get(req.query.jwttoken)
        .then(function (token) {
            if (token.length <= 0) {
                res.send({ jwt: false })
            }
            else {
                itemList.get(token)
                    .then(function (results) {
                        res.send(results)
                    })               
            }
        })
})

app.get('/sync', function (req, res) {
    var token = ""
    cookieToToken.get(req.query.jwttoken)
        .then(function (apitoken) {
            token = apitoken[0].jetapitoken
            return syncItemList.get(token)    
        })
        .then(function (data) {
            var arr = []
            for (i in data) {                
                itemdetails.get(data[i], token)
                    .then(function (details) {
                        arr.push(details)
                        if (data.length == arr.length) {
                            for (x in arr) {
                                insertItems.add(arr[x].merchant_sku, arr[x].merchant_id)
                            }
                            for (y in arr) {
                                updateItemSync.get(arr[y].product_title, arr[y].pack_quantity, arr[y].brand, arr[y].image_url, arr[y].upc_code, arr[y].product_description, arr[y].manufacturer, arr[y].manufacturers_part_number, arr[y].bullets[1], arr[y].bullets[2], arr[y].bullets[3], arr[y].bullets[4], arr[y].bullets[5], arr[y].shipping_weight, arr[y].merchant_id, arr[y].merchant_sku)
                            }

                        } else { }
                    })
            }
        })
})


app.get('/getOrderItem', function (req, res){
    getOrderItems.query(req.query.jwttoken, req.query.orderId)
        .then(function (items) {
            res.send({ data: items })
        })
})

app.post('/refund-order', function (req, res) {
    cookieToToken.get(req.body.jwttoken)
        .then(function (token) {
            rma.send(req.body.refunds[0].return_id, req.body.refunds[0].order_id, token[0].jetapitoken, req.body.refunds)
        })
        .then(function (data) {
            res.send(data)})
})
    


app.post('/ship', function (req, res) {

    var orderid = req.body.orderid
    var carrier = req.body.carrier
    var method = req.body.method
    var trackingNumber = req.body.trackingNumber
    var shipDate = req.body.shipDate
    var estimatedDelivery = req.body.estimatedDelivery
    var token = ""
    var status = ""
    var reference_order_id = ""
    
    cookieToToken.get(req.body.jwttoken)
        .then(function (apitoken) {
            token = apitoken[0].jetapitoken
            return orderItems.query(orderid)
        })
        .then(function (items) {
            //console.log(token)
            return ship.send(orderid, token, trackingNumber, shipDate, method, estimatedDelivery, carrier, items)
        })
        .then(function (details) {
            return orderdetails.get(orderid, token)
            console.log(body.status, details.status)
            status = body.status
            reference_order_id = body.reference_order_id
        })
        .then(function (update) {
            updateOrder.get(update.status, update.reference_order_id)
            res.send(update)
        })
})

app.post('/jetdetails', function (req, res) {
    console.log(req.body.merchantId)
    var email = ""
    apikeys.add(req.body.jwttoken, req.body.jetapiuser, req.body.jetapisecret, req.body.merchantId)
	.then(function (data) {
        email = data.email
        console.log(data.apiuser, data.apipass)
	    return auth.authToken(data.apiuser, data.apipass)
	})
    .then(function (data) {
        console.log(data.id_token, data.user, email)
        return apitoken.add(data.id_token, data.user, email)
    })
        .then(function (data) {
        console.log(data)
        res.send(data)
    })
    .catch(function (error) {
        console.log(error)
    })
})

app.get('/dashboard', function (req, res) {
    cookieToToken.get(req.query.jwttoken)
    .then(function (token) {
        if (token.length <= 0) {
            res.send({jwt: false})
        }else{
            var p1 = numberOfOrders.getorders("acknowledged", token[0].jetapitoken)
            var p2 = numberOfItems.get(token[0].jetapitoken)
            var p3 = numberOfReturns.get("created", token[0].jetapitoken)
            Promise.all([p1,p2,p3])
            .then(function (data) {
                console.log({ "orders": data[0], "items": data[1], "returns": data[2] })
                res.send({"orders": data[0], "items": data[1], "returns": data[2], jwt: true})
            })
        }
    })
    .catch(function (error) {
        console.log(error)
    })
})

app.post('/login', function (req, res) {
    login.query(req.body.email, req.body.password)
        .then(function (data) {
            res.send(data)
            console.log(data)
        })
})


app.get('/auth', function (req, res) {
    auth.authToken(req.rawHeaders[7], req.rawHeaders[9])
        .then(function (data) {
            res.send(data)
        })
})

app.put('/upload', function (req, res) {
    upload.send()
    .then(function (data) {
        res.send(data)
    })
})
 
app.put('/updateprice', function (req, res) {
    updateprice.send()
    .then(function (data) {
        res.send(data)
    })
})

app.put('/updateinv', function (req, res) {
    updateinv.send()
    .then(function (data) {
        res.send(data)
    })
})

app.put('/active', function (req, res) {
    active.send()
    .then(function (data) {
        res.send(data)
    })
})

app.get('/orderstatus', function (req, res) {
    orders.getorders(req.query.status)
    .then(function (data) {
        res.send(data)
    })
})

app.get('/orderdetails', function (req, res) {
    orderdetails.get("5cb256774e064e2a9f54472e89036309","eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IldscUZYb2E1WkxSQ0hldmxwa1BHOVdHS0JrMCJ9.eyJpc19zYW5kYm94X3VpZCI6IlRydWUiLCJtZXJjaGFudF9pZCI6IjYwZDY0Y2Q2YTllNDRmM2M4ODk3Yzc1MDZmYjQ5NjFjIiwicGFydG5lcl90eXBlIjoiTWVyY2hhbnQiLCJzY29wZSI6Imlyb25tYW4tYXBpIiwiaXNzIjoiamV0LmNvbSIsImV4cCI6MTQ5ODE0NzIzNywibmJmIjoxNDk4MTExMjM3fQ.clI4oHZCoel0Rluujl_HU8PRAV3js63O1AOenKqpuHY0ni4OXeZD7fIZzmHePytH1VsvdreXp0WKuoaKjMuUr4IgZvaFUg7rSsC1_ML3BiVRvCffLxO4mspR5QEvX4gHg01MAAJkVGiQJLeRrf20F9d2eEwlAQJ2gVgiNHIhzB66EhkTfdpWEl1G2gztaoZmhhHmV7LoPJUKOe-kJrZERWVbTXOp-BgyJGRUAXGhA-W5YsVzILNV__IZbIZtGIevByAHxJB0OURjIzVyImVbvUkjsL5HI08okT0gkbxOrfQhOEKXQaHycaGdAoakKO6n31aGH355t9rHsN3_lNHlu-jR6wQFqs08JrzxGUELjRgXh2ZKybgw7lROx0Ht_dI-SU5qxUQFV3g3gkwt4F9sLk04E7IW_Af3TJXOPHl4-F_fFc7yr51fu-lkyHmyqt-xAiuS5AlHHxIVbWSEV85IF0wLd5ODJsH4MqbEeS4ANvZE6P_2vy412kk3qAN13cGcJyM_7-lDrG6Nn-wdCVQrzcMe-SeTqgefRGqZcN0ncWJ88nhcBMPXswZB8RFd6SHypjP-5e7r8Ucx7opr2RntJluzgfjD-9cIhKWJWqJDMPyTALZa9ygNTE37_8ejjfGPbNTOj2rjMiSuktVDfKRy7XA_QxNWgPa7P5AppXehSDM")
    .then(function (data) {
        res.send(data)
    })
})

app.put('/shiparray', function (req, res) {
    shiparray.send(req.query.orderid)
    .then(function (data) {
        res.send(data)
    })
})

//app.get('/orders', function (req, res) {
//    var jetapitoken = ""
//    cookieToToken.get(req.query.jwttoken)
//    .then(function (data) {
//        jetapitoken = data[0].jetapitoken
//        return orders.getorders("acknowledged", data[0].jetapitoken)
//    })
//    .then(function (id_array) {
//        //console.log(id_array)
//        for (var i in id_array) {
//            setTimeout(function () { listorderdetails(id_array[i], id_array.length) }, i+10);
//            }
//        var arr = []
//        function listorderdetails(data, len) {
//            orderdetails.get(data, jetapitoken)
//                .then(function (data) {
//                arr.push({
//                    "order":data
//                })
//                    console.log(arr.length, len)
//                if (arr.length == len) {
//                    console.log(arr)
//                    res.send(arr)
//                }
//            })
//            }
//    })          
//})
//TODO: add merchant id to WHERE clause
app.get('/orders', function (req, res) {
    console.log(req.query.request)
    var arr = []
    validateToken.get(req.query.jwttoken)
        .then(function (token) {
            if (token.length <= 0) {
                res.send({ jwt: false })
            } else {
                switch (req.query.request) {
                    case "orders":
                        orderList.get(token)
                            .then(function (results) {
                                res.send(results)
                                //console.log(results)
                            })
                        break;

                    case "returns":
                        var token = ""
                        cookieToToken.get(req.query.jwttoken)
                            .then(function (myToken) {
                                token = myToken;
                                return returns.get(token, "created")
                            })
                            .then(function (returnid) {
                                //console.log(token[0].jetapitoken, "1234")
                                //console.log(returnid)
                                return returnDetails.get(returnid, token)
                            })
                            .then(function (insert) {
                                console.log(insert)
                                var arr = []
                                for (i in insert) {
                                    console.log(arr.length, insert.length)
                                    returnInsert.get(insert[i].return_id, insert[i].order_id)
                                        .then((data) => {
                                            arr.push(data)
                                            if (arr.length == insert.length) {
                                                        //console.log(arr)
                                                returnList.get(arr)
                                                    .then(function (results) {
                                                        console.log(results)
                                                        res.send(results)
                                                    })
                                            }
                                            else { }
                                        })
                                        
                                }
                            })
                        break;
                }
            }
        })
})



app.get('/returns', function (req, res) {
    var arr = []
    validateToken.get(req.query.jwttoken)
        .then(function (token) {
            if (token.length <= 0) {
                res.send({ jwt: false })
            } else {
                return orderList.get(token)
            }
        })
        .then(function (results) {
            res.send(results)
            console.log(results)
        })
        .catch(function (error) {
            console.log(error)
        })
})

app.get('/items', function (req, res) {
    items.getitems().then(function (id_array) {
        for (var i in id_array) {
            listitemdetails(id_array[i], id_array.length)
        }
        var arr = []
        function listitemdetails(data, len) {
            itemdetails.get(data).then(function (data) {
                arr.push({
                    "details": data
                })
                if (arr.length == len) {
                    res.send(arr)
                }
            })
        }
    })
})

app.get('/numberOfOrders', function (req, res){
    numberOfOrders.getorders(req.query.status)
    .then(function (data) {
        res.send({
            "orders": data
        })
    })
    .catch(function (error) {
        console.log(error)
    })
})

app.get('/numberOfItems', function (req, res) {
    numberOfItems.get()
    .then(function (data) {
        res.send({ "skus": data })
    })
    .catch(function (error) {
        console.log(error)
    })
})

app.get('/numberOfReturns', function (req, res) {
    numberOfReturns.get(req.query.status)
    .then(function (data) {
        res.send({
            "returns": data
        })
    })
    .catch(function (error) {
        console.log(error)
    })
})

app.listen(3000, function () {
    console.log('==========INITIALIZED ON PORT 3000==========')
})
