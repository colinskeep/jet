var auth = require('./auth.js');
var request = require('request');
var fs = require('fs');

exports.getitems = function () {
    var global_data = fs.readFileSync("auth.txt").toString();
    return new Promise(function (resolve, reject) {
        request.get({
            url: "https://merchant-api.jet.com/api/merchant-skus/",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + global_data + ""
            },
            json: true
        },
            function (error, response, body) {
                if (error) {
                    reject(error)
                }
                else {
                    var arr = []
                    for (var i in body.sku_urls) {
                        var ids = body.sku_urls[i].split("/")
                        arr.push(ids[1])
                    }
                    console.log(arr)
                    resolve(arr)
                }
            }
        );
    })
}