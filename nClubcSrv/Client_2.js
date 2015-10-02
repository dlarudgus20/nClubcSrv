var Logger = require('./Logger.js');
var Room = require('./Room.js');

var CCC2Protocol = {
	CMD_CNT_SUCCEED: [ 0x7f, 0x0a, 0x2f, 0x55, 0xda, 0x72, 0 ],
	CMD_MY_NICKNAME: [ 0xf2, 0x3b, 0x7f, 0xee, 0xc9, 0x76 ],
	CMD_CNTLIST_BEGIN: [ 0xe9, 0x3f, 0x77, 0x79, 0x1d, 0x36, 0x9a, 0x83, 0 ],
	CMD_CNTLIST_END: [ 0x93, 0x11, 0xf8, 0x8e, 0x0a, 0xf0, 0x5a, 0x82, 0 ],
	CMD_CNTLIST_ADD: [ 0x98, 0x1f, 0x9c, 0x3a, 0x9f, 0xef, 0xf9, 0xfa, 0x7b ],
	CMD_CNTLIST_REMOVE: [ 0xa1, 0xfa, 0x93, 0x91, 0x82, 0x90, 0x46, 0x72, 0x13 ]
};
var message = {
	EnterNotify: '님께서 들어오셨습니다. [CCC2 호환 레이어]',
	LeaveNotify: '님께서 나가셨습니다. [CCC2 호환 레이어]',
	PrefixNotice: '<공지> ',
	PrefixWhisper: '<귓속말> ',
	ExitedRoom: '<CCC2 호환 레이어> 방에서 나가졌습니다. 재입장을 시도하려면 "<<join>>"이라고 입력하십시오.',
	RejoinRoom: '<<join>>'
};

function Client_2(conn, buf)
{
	this.connection = conn;
	this.recvBufs = [];

	this.id = null; // 로그인 이후에는 무효화됨.
	this.user = null;
	this.bChecking = false;
	this.room = Room.getDefaultRoom();

	// to process initial buf
	this.onData(buf);
}

Client_2.prototype.toString = function() {
	return this.connection.toString();
}

Client_2.prototype.getClientKind = function() {
	return 'Client 2';
}

Client_2.prototype.isLogined = function() {
	return this.user != null;
}

Client_2.prototype.getUser = function() {
	return this.user;
}

Client_2.prototype.sendCheckPacket = function() {
	if (!this.bChecking)
	{
		var sock = this.connection.getSocket();
		var that = this;
		sock.write(new Buffer([ 0 ]), function() {
			that.bChecking = false;
		});
		return true;
	}
	else
	{
		Logger.log(this, 'Check Failed');
		return false;
	}
}

Client_2.prototype.onData = function(data) {
	var i, j = 0;
	for (i = 0; i < data.length; i++)
	{
		if (data[i] == 0)
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
	var that = this;

	if (this.id == null)
	{
		this.id = data.toString('utf8');
	}
	else if (this.user == null)
	{
		var pw = data.toString('utf8');

		this.socket.pause();
		var usrdb = this.connection.getServer().getUserDB();
		usrdb.login(this.id, pw, function(usr) {
			that.id = '';
			that.user = usr;

			;

			that.socket.resume();
		});
	}
	else
	{
		var chat = data.toString('utf8');

		var idx = chat.indexOf(':');
		if (idx != -1 && idx + 2 < chat.size())
		{
			var msg = chat.slice(idx + 2);
			if (this.room != null)
			{
				this.room.SayToRoom(this.user, msg);
			}
			else
			{
				if (msg == message.RejoinRoom)
				{
					this.user.JoinRoom(this, Room.getDefaultRoom());
				}
				else
				{
					this.socket.write(message.ExitedRoom);
				}
			}
		}
	}
}

Client_2.prototype.onEnd = function() {

}

module.exports = Client_2;
