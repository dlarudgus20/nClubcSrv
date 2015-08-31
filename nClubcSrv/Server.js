var net = require('net');

var Logger = require('./Logger.js');
var Connection = require('./Connection.js');

function Server(port)
{
	this.port = port;
	this.tcpsrv = null;
}

Server.prototype.toString = function() {
	return 'Server';
}

Server.prototype.start = function() {
	var that = this;

	Logger.log(this, 'server start');
	var tcpsrv = net.createServer(function(socket) {
		var conn = new Connection(that, socket);
		conn.onConnect();
	});
	tcpsrv.listen(this.port, function() {
		Logger.log(that, 'listening on ' + that.port);
	});
}

module.exports = Server;
