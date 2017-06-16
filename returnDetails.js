var request = require('request');



exports.get = function (returnid, token) {
    return new Promise(function (resolve, reject) {
        var numReturns = returnid.length
        var arr = []
        for (x in returnid) {
            request.get({
                url: "https://merchant-api.jet.com/api/returns/state/" + returnid[x] + "",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + token[0].jetapitoken + ""
                },
                json: true
            },
                (error, response, body) => {
                    if (error) {
                        reject(error)
                    }
                    else {
                        arr.push(body.merchant_order_id)
                        console.log(body.merchant_order_id)
                        if (arr.length >= numReturns) {
                            resolve(arr)
                        }
                    }
                })
        }
    })
}