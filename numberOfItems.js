var auth = require('./auth.js');
var request = require('request');


exports.get = function (jetapitoken) {
    return new Promise(function (resolve, reject) {
        if (jetapitoken != "undefined") {
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
                        if (body && body.sku_urls && body.sku_urls.length > 0) {
                            var len = body.sku_urls.length
                            resolve(len)
                        }
                        else {
                            resolve("Error")
                        }
                    }
                }
            );
        }
        else {
            resolve({ jwt: false })
        }
    })
}