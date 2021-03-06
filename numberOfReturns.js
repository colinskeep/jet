var auth = require('./auth.js');
var request = require('request');

exports.get = function (status, jetapitoken) {
    return new Promise(function (resolve, reject) {
        if (jetapitoken != "undefined") {
            request.get({
                url: "https://merchant-api.jet.com/api/returns/" + status + "",
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
                        if (body && body.return_urls && body.return_urls.length > 0) {
                            var len = body.return_urls.length
                            resolve(len)
                        }
                        else {
                            resolve("no returns")
                        }
                    }
                })
        }
        else {
            resolve({ jwt: false })
            }
    })
} 
