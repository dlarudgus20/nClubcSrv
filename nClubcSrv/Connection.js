var Logger = require('./Logger.js');
var Client_2 = require('./Client_2.js');

var verSize = 5;
var versions = [
	{ ver: [ 0xa2, 0xa0, 0xa0, 0xb4, 0 ], Con:Client_2 }
];

function Connection(server, socket)
{
	this.server = server;
	this.socket = socket;
	this.recvVer = [];
	this.client = null;
};

Connection.prototype.toString = function() {
	var str = 'Client (' + this.socket.remoteAddress + ':' + this.socket.remotePort + ')';
	if (this.client != null)
	{
		str += ' ' + this.client.getClientKind();
		if (this.client.isLogined())
		{
			str += ' (' + this.client.getUser().getNick() + ')';
		}
	}
	return str;
}

Connection.prototype.getServer = function() {
	return this.server;
}

Connection.prototype.getSocket = function() {
	return this.socket;
}

Connection.prototype.destroy = function() {
	this.socket.destroy();
}

Connection.prototype.onConnect = function() {
	var that = this;

	Logger.log(this, 'connected');

	this.socket.on('end', function() {
		if (that.client != null)
			that.client.onEnd();

		that.server.removeClient(that);
		Logger.log(that, 'disconnected');
	});
	this.socket.on('data', function(data) {
		if (that.client != null)
			that.client.onData(data);

		var idx;
		for (idx = that.recvVer.length; idx < Math.min(data.length, 5); idx++)
		{
			that.recvVer[idx] = data[idx];
		}

		if (idx >= verSize)
		{
			for (var i = 0; i < versions.length; i++)
			{
				var found = that.recvVer.every(function(n, j) {
					return versions[i].ver[j] == n;
				});
				
				if (found)
				{
					that.client = new versions[i].Con(that, data.slice(idx));
					return;
				}
			}

			// invalid client
			Logger.log(that, 'invalid client');
			that.server.removeConnection(that);
			that.socket.destroy();
		}
	});
}

// TODO: timer check

module.exports = Connection;
