var auth = require('./auth.js');
var request = require('request');

exports.getorders = function (status, jetapitoken) {
    return new Promise(function (resolve, reject) {
        request.get({
            url: "https://merchant-api.jet.com/api/orders/" + status + "",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + jetapitoken + ""
            },
            json: true
        },
            function (error, response, body) {
                if (error) {
                    reject(error)
                }
                else {
                    var len = body.order_urls.length
                    resolve(len)      
                }
            }
        );
    })
}