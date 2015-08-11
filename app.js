var net = require('net');
var assert = require('assert');

var CCC2Protocol = {
	VERSION_STR: new Buffer([ 0xa2, 0xa0, 0xa0, 0xb4, 0 ]),
	CMD_CNT_SUCCEED: new Buffer([ 0x7f, 0x0a, 0x2f, 0x55, 0xda, 0x72, 0 ]),
	CMD_MY_NICKNAME: new Buffer([ 0xf2, 0x3b, 0x7f, 0xee, 0xc9, 0x76 ]),
	CMD_CNTLIST_BEGIN: new Buffer([ 0xe9, 0x3f, 0x77, 0x79, 0x1d, 0x36, 0x9a, 0x83, 0 ]),
	CMD_CNTLIST_END: new Buffer([ 0x93, 0x11, 0xf8, 0x8e, 0x0a, 0xf0, 0x5a, 0x82, 0 ]),
	CMD_CNTLIST_ADD: new Buffer([ 0x98, 0x1f, 0x9c, 0x3a, 0x9f, 0xef, 0xf9, 0xfa, 0x7b ]),
	CMD_CNTLIST_REMOVE: new Buffer([ 0xa1, 0xfa, 0x93, 0x91, 0x82, 0x90, 0x46, 0x72, 0x13 ])
};

var logger = new Logger();
var server = new Server();

server.start();

function Server()
{
	this.tcpsrv = null;
	this.clients = [];
	this.toString = function() {
		return 'Server';
	}
	this.start = function() {
		logger.log('server start');
		var tcpsrv = net.createServer(function(socket) {
			var client = new Client(socket);
			this.clients.push(client);
			client.onConnect();
		});
		tcpsrv.listen(12345, function() {
			logger.log('server bound');
		});
	}
}

function Client(socket)
{
	this.socket = socket;
	this.onConnect = function() {
		console.log('connected');
		this.socket.setEncoding('binary');
	
		this.socket.on('end', function() {
			console.log('disconnected');
		});
	}
}

function Logger()
{
	this.log = function(obj, topic, detail) {
		var str = '<' + obj.toString() + '> ' + topic;
		if (typeof detail !== 'undefined')
		{
			str += ' : ' + detail;
		}
		str += ' [' + getNowDateStr() + ']';
		console.log(str);
	};
}

function getNowDateStr()
{
    var date = new Date();

	var strization = function(num) {
		return (num < 10 ? '0' : '') + num;	
	};

    return date.getFullYear()
		+ '-' + strization(date.getMonth() + 1)
		+ '-' + strization(date.getDate())
		+ ' ' + strization(date.getHour())
		+ ':' + strization(date.getMinutes())
		+ ':' + strization(date.GetSeconds());
}

// https://nodejs.org/api/buffer.html
// http://substack.net/binary_stream_parsing_in_node
