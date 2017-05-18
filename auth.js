var request = require('request');
var path = "C:\\Users\\HQ\\jet\\auth.txt";
var fs = require('fs');
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
            resolve(body.id_token)
            fs.writeFile(path, body.id_token)
        }
    );
    })
}