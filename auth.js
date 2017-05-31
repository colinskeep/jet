var request = require('request');
var path = "auth.txt";
exports.authToken = function (user, pass) {
    return new Promise(function (resolve, reject) {
        request.post({
            url: "https://merchant-api.jet.com/api/token",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                "user": user,
                "pass": pass
            },
            json: true
        }, function (error, response, body) {
            resolve({"id_token": body.id_token, "user": user})
        }
    );
    })
}