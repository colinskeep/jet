var id = require('./itemDetails.js');
var request = require('request');

exports.getorders = function (status, jetapitoken) {
    return new Promise(function (resolve, reject) {
        var milliseconds = (new Date).getTime();
        request.get({
            url: "https://merchant-api.jet.com/api/orders/" + status + "?id="+milliseconds+"",
            //url: "http://requestb.in/qd57srqd",
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
                    if (body && body.order_urls && body.order_urls.length >= 1) {
                        var arr = []
                        for (var i in body.order_urls) {
                            var ids = body.order_urls[i].split("/")
                            arr.push(ids[3])
                            resolve(arr)
                        }
                        }
                    else{
                        resolve("No Orders")
                        }
                    }
                    
                }
            
        );
    })
}