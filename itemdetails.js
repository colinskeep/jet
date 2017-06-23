var auth = require('./auth.js');
var request = require('request');
var cookieToToken = require('./cookieToToken.js')
var fs = require('fs');


exports.get = function (sku, token) {

    return new Promise(function (resolve, reject) {
        request.get({
            url: "https://merchant-api.jet.com/api/merchant-skus/" + sku + "",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + token + ""
            },
            json: true
        },
            function (error, response, body) {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(body)
                }
            }
        );
    })
}