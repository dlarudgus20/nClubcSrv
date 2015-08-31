var MemoryStream = require('memorystream');

var Logger = require('./Logger.js');

var CCC2Protocol = {
	CMD_CNT_SUCCEED: [ 0x7f, 0x0a, 0x2f, 0x55, 0xda, 0x72, 0 ],
	CMD_MY_NICKNAME: [ 0xf2, 0x3b, 0x7f, 0xee, 0xc9, 0x76 ],
	CMD_CNTLIST_BEGIN: [ 0xe9, 0x3f, 0x77, 0x79, 0x1d, 0x36, 0x9a, 0x83, 0 ],
	CMD_CNTLIST_END: [ 0x93, 0x11, 0xf8, 0x8e, 0x0a, 0xf0, 0x5a, 0x82, 0 ],
	CMD_CNTLIST_ADD: [ 0x98, 0x1f, 0x9c, 0x3a, 0x9f, 0xef, 0xf9, 0xfa, 0x7b ],
	CMD_CNTLIST_REMOVE: [ 0xa1, 0xfa, 0x93, 0x91, 0x82, 0x90, 0x46, 0x72, 0x13 ]
};

function Client_2(conn, buf)
{
	this.connection = conn;
	this.recvBufs = [];

	this.id = null;
	this.pw = null;

	// to process initial buf
	this.onData(buf);
}

Client_2.prototype.toString = function() {
	return 'Client_2';
}

Client_2.prototype.onData = function(data) {
	var i, j = 0;
	for (i = 0; i < data.length; i++)
	{
		if (data[i] == '\0')
		{
			var thestr = data.slice(j, i - j + 1);
			if (j == 0)
			{
				this.recvBufs.push(thestr);
				thestr = Buffer.concat(this.recvBufs);
				this.recvBufs = [];
			}
			j = i + 1;

			this.processString(thestr);
		}
	}
	if (i != j)
	{
		this.recvBufs.push(data.slice(j, i - j + 1));
	}
}

Client_2.prototype.processString = function(data) {
	if (this.id == null)
	{
		data.setEncoding('utf8');
		this.id = data.toString();
	}
	else if (this.pw == null)
	{
		data.setEncoding('utf8');
		this.pw = data.toString();

		this.socket.pause();
	}
}

Client_2.prototype.onEnd = function() {

}

module.exports = Client_2;
