var auth = require('./auth.js');
var request = require('request');

exports.get = function (jetapitoken, status) {
    return new Promise(function (resolve, reject) {
        //console.log(jetapitoken[0].jetapitoken)
        if (jetapitoken != "undefined") {
            request.get({
                url: "https://merchant-api.jet.com/api/returns/" + status + "",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + jetapitoken[0].jetapitoken + ""
                },
                json: true
            },
                function (error, response, body) {
                    if (error) {
                        reject(error)
                    }
                    else {
                        //if (body && body.order_urls && body.order_urls.length >= 1) {
                        var arr = []
                        if (body) {
                            for (var i in body.return_urls) {
                                var ids = body.return_urls[i].split("/")
                                arr.push(ids[3])     
                            }
                            resolve(arr)
                            //console.log(arr, "returns.js")
                        }
                        else {
                            resolve("No Returns")
                        }
                    }
                })
        }
        else {
            resolve({ jwt: false })
            }
    })
} 
