var express = require('express')
var app = express()
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

app.get('/'), function (req, res) {
    res.send({
        "data":"cock"
    })
}

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
    orders.getorders(req.query.status).then(function (id_array) {
        for (var i in id_array) {
            listorderdetails(id_array[i], id_array.length)
            }
        var arr = []
        function listorderdetails(data, len) {
            orderdetails.get(data).then(function (data) {
                arr.push({
                    "order":data
                })
                if (arr.length == len) {
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
        console.log(data)
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
