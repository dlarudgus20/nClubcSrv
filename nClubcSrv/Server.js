var net = require('net');

var Logger = require('./Logger.js');
var Connection = require('./Connection.js');
var UserDB = require('./UserDB.js');
var Room = require('./Room.js');

function Server(port)
{
	this.port = port;
	this.tcpsrv = null;
	this.usrdb = null;
}

Server.prototype.toString = function() {
	return 'Server';
}

Server.prototype.getUserDB = function() {
	return this.usrdb;
}

Server.prototype.start = function() {
	var that = this;

	Logger.log(this, 'server start');

	Logger.log(this, 'connecting to UserDB');
	this.usrdb = UserDB.construct();
	this.usrdb.init(function() {
		Logger.log(this, 'creating default room');
		Room.getDefaultRoom(); // create

		Logger.log(this, 'starting to listen socket');
		var tcpsrv = net.createServer(function(socket) {
			var conn = new Connection(that, socket);
			conn.onConnect();
		});
		tcpsrv.listen(that.port, function() {
			Logger.log(that, 'listening on ' + that.port);
		});
	});
}

module.exports = Server;
