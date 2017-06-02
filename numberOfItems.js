var auth = require('./auth.js');
var request = require('request');


exports.get = function (jetapitoken) {
    return new Promise(function (resolve, reject) {
        request.get({
            url: "https://merchant-api.jet.com/api/merchant-skus",
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
                    var len = body.sku_urls.length
                    resolve(len)
                }
            }
        );
    })
}