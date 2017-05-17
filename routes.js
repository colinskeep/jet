'use strict';
var auth = require('./auth.js');
var upload = require('./upload.js');
var updateinv = require('./updateInventory.js');
var updateprice = require('./updatePrice.js');

module.exports = function (app) {
	
    app.route('/auth').post(auth);
    app.route('/upload').put(upload);
    app.route('/updateinv').get(updateinv);
    app.route('/updateprice').get(updateprice);

	//app.route('/*').get(function (req, res) {
 // res.sendStatus(404);
  //});


}