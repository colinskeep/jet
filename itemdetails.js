var request = require('request');



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