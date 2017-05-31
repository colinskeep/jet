const jwt = require('jsonwebtoken')

exports.make = (object) => {
    return new Promise(function (resolve, reject) {
        try {
            const authToken = jwt.sign(object, process.env.PRIVATE_KEY);
            resolve(authToken)
        } catch (err) {
            reject(Error(err))
        }
    })
}

exports.read = (authToken) => {
    return new Promise(function (resolve, reject) {
        try {
            var token = jwt.verify(authToken, process.env.PRIVATE_KEY);
            resolve(token)
        } catch (err) {
            reject(Error(err))
        }
    })
}