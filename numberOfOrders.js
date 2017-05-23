var auth = require('./auth.js');
var request = require('request');
var fs = require('fs');

exports.getorders = function (status) {
    var global_data = fs.readFileSync("auth.txt").toString();
    return new Promise(function (resolve, reject) {
        request.get({
            url: "https://merchant-api.jet.com/api/orders/" + status + "",
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
                    console.log(body.order_urls.length)
                    var len = body.order_urls.length
                    resolve(len)      
                }
            }
        );
    })
}