var request = require('request');



exports.get = function (orderid, jetapitoken) {

    return new Promise(function (resolve, reject) {
        request.get({
            url: "https://merchant-api.jet.com/api/orders/withoutShipmentDetail/" + orderid + "",
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
                    resolve(body)
                }
            }
        );
    })
}