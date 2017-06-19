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


app.get('/getOrderItem', function (req, res){
    getOrderItems.query(req.query.jwttoken, req.query.orderId)
        .then(function (items) {
            res.send({ data: items })
        })
})

app.put('/refund-order/', function (req, res) {
    getOrderDetails.get(req.query.jwttoken, req.body.orderId)
        .then(function (orders) {
            return orders
        })
        .then(function (items) {
            return getOrderItems(req.query.jwttoken, req.query.orderId)
        })
        .then(function (data) {
            console.log(orders, items)
            res.send(orders, items)
            
        })
})
    


app.post('/ship', function (req, res) {

    var orderid = req.body.orderid
    var carrier = req.body.carrier
    var method = req.body.method
    var trackingNumber = req.body.trackingNumber
    var shipDate = req.body.shipDate
    var estimatedDelivery = req.body.estimatedDelivery
    var token = ""
    
    cookieToToken.get(req.body.jwttoken)
        .then(function (apitoken) {
            token = apitoken[0].jetapitoken
            return orderItems.query(orderid)
        })
        .then(function (items) {
            //console.log(token)
            return ship.send(orderid, token, trackingNumber, shipDate, method, estimatedDelivery, carrier, items)
        })
        .then(function (data) {
            console.log(data)
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
    orderdetails.get("3b8b963125df4684afbaf272fe381660")
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
                            .then(function (data) {
                                console.log(data, "data function")
                                return returnList.get(data)
                            })
                            .then(function (results) {
                                res.send(results)
                                console.log(results)
                            })
                        break;
                }
            }
         })
        .catch(function (error) {
            console.log(error)
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
