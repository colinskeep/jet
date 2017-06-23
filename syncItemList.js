var request = require('request');

exports.get = function (jetapitoken) {

    return new Promise(function (resolve, reject) {
        request.get({
            url: "https://merchant-api.jet.com/api/merchant-skus/",
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
                    var arr = []
                    for (i in body.sku_urls) {
                        var id = body.sku_urls[i].split("/")
                        arr.push(id[1])
                        if (arr.length == body.sku_urls.length) {
                            resolve(arr, jetapitoken)
                        }
                    }

                }
            }
        );
    })
}