var express = require('express')
var app = express()
var auth = require('./auth.js')
var upload = require('./itemupload.js')
var updateinv = require('./updateinventory.js')
var updateprice = require('./updatePrice.js')
var active = require('./active.js')
var orders = require('./orders.js')
var orderdetails = require('./orderdetails.js')
var acknowledge = require('./acknowledge.js')

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

app.get('/orders', function (req, res) {
    orders.getorders("ready")
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

app.get('/acknowledge', function (req, res) {
    acknowledge.put("3b8b963125df4684afbaf272fe381660", "f0e018c6fc934a0a90a5d2c85a2102b2")
    .then(function (data) {
        res.send(data)
    })
})

app.listen(3000, function () {
    console.log('==========INITIALIZED ON PORT 3000==========')
})
