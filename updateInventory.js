var request = require('request');

exports.send = function (sku, token, fid, inventory) {

    return new Promise(function (resolve, reject) {
        request.put({
            url: "https://merchant-api.jet.com/api/merchant-skus/" + sku + "/Inventory",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token + ""
            },
            body: {
                "fulfillment_nodes": [
                    {
                        "fulfillment_node_id": "" + fid + "",
                        "quantity": parseInt(inventory)
                    }
                ]
            },
            json: true
        },

            function (error, response, body) {
                if (error) {
                    reject(error)
                }
                else {
                    if (response.body){
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