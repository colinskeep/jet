var request = require('request');

exports.send = function (sku, token, price) {
    return new Promise(function (resolve, reject) {
        request.put({
            url: "https://merchant-api.jet.com/api/merchant-skus/" + sku + "/price",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token + ""
            },
            body: {
                "price": parseFloat(price)
            },
            json: true
        },

            function (error, response, body) {
                if (error) {
                    reject(error)
                }
                else {
                    if (response.body) {
                        resolve(response.body)
                    }
                    else {
                        resolve(true)
                    }
                }
            }
        );
    })
}    