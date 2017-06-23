var request = require('request');



exports.get = function (returnid, token) {
    return new Promise(function (resolve, reject) {
        
        var numReturns = returnid.length
        var arr = []
        //console.log(returnid, "returnDetails.js")
        for (x in returnid) {
            var returnids = ""
            returnids = returnid[x]
            //console.log(returnids,"dick")
            request.get({
                url: "https://merchant-api.jet.com/api/returns/state/" + returnids + "",
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
                        //console.log(body)
                        arr.push({
                            return_id: body.merchant_return_authorization_id,
                            order_id: body.merchant_order_id
                        })
                        //console.log(body.merchant_order_id)
                        if (arr.length >= numReturns) {
                            resolve(arr)
                        }
                    }
                })
        }
    })
}