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

app.get('/', function (req, res) {
  res.send({
     "data":"dick"
    })
})


//TODO: get authtoken and insert into database after user / pass are submitted
app.post('/register', function (req, res) {
	mysql.query(req.body.password, req.body.email)
	.then(function(data) {
        res.send(data)
	})
.catch(function (error) {
        console.log(error)
    })
})

app.post('/jetdetails', function (req, res) {
    var email = ""
    apikeys.add(req.body.jwttoken, req.body.jetapiuser, req.body.jetapisecret)
	.then(function (data) {
	    email = data.email
	    return auth.authToken(data.apiuser, data.apipass)
	})
    .then(function (data) {
        apitoken.add(data.id_token, data.user, email)
        return apitoken.add(data.id_token, data.user)
    })
    .then(function (data) {
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

        }else{
            var p1 = numberOfOrders.getorders("acknowledged", token[0].jetapitoken)
            var p2 = numberOfItems.get(token[0].jetapitoken)
            var p3 = numberOfReturns.get("created", token[0].jetapitoken)
            Promise.all([p1,p2,p3])
            .then(function (data) {
                console.log({ "orders": data[0], "items": data[1], "returns": data[2] })
                res.send({"orders": data[0], "items": data[1], "returns": data[2]
                })
            })
        }
    })
    .catch(function (error) {
        console.log(error)
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

app.get('/orders', function (req, res) {
    var jetapitoken = ""
    cookieToToken.get(req.query.jwttoken)
    .then(function (data) {
        jetapitoken = data[0].jetapitoken
        return orders.getorders("acknowledged", data[0].jetapitoken)
    })
    .then(function (id_array) {
        //console.log(id_array)
        for (var i in id_array) {
            setTimeout(function () { listorderdetails(id_array[i], id_array.length) }, i+10);
            }
        var arr = []
        function listorderdetails(data, len) {
            orderdetails.get(data, jetapitoken)
                .then(function (data) {
                arr.push({
                    "order":data
                })
                    console.log(arr.length, len)
                if (arr.length == len) {
                    console.log(arr)
                    res.send(arr)
                }
            })
            }
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
