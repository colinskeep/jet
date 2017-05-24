const mysql = require('mysql');
require('dotenv').config();
const connection = mysql.createConnection({
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
});

exports.query = (password,email) => {
    console.log(password,email)
    return new Promise((resolve, reject) => {
        //if(SQLstatement){
            connection.connect((err) => {
                if(err){
                    reject(Error(err))
                } else {
		    console.log(password,email)
		    var querystring = `INSERT INTO users (password,email) VALUES ('${password}','${email}');`
		    console.log(querystring)
                    connection.query(querystring, (error, results, fields) =>{
			console.log(results)
                        resolve(results)
                        //connection.end()
                        if (err) {
                            reject(Error(err))
                        }
                    });
                }
            })
        //} else (
            //reject(Error('No SQL statement provided'))
        //)
    })
}
