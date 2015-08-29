var sqlite3 = require('sqlite3');

var User = require('./User.js');

/****************
 * RawUserDb    *
 ****************/
function RawUserDb()
{
	this.handleCounter = 0;
	this.users = [];
}

RawUserDb.prototype.init = function(callback, thisObj) {
	callback.call(thisObj);
}

RawUserDb.prototype.getUser = function(handle, callback, thisObj) {
	callback.call(thisObj, this.users.find(function(usr) {
		return usr.getHandle() == handle;
	}));
}

RawUserDb.prototype.getUserFromNick = function(nick, callback, thisObj) {
	callback.call(thisObj, this.users.find(function(usr) {
		return usr.getNick() == nick;
	}));
}

RawUserDb.prototype.login = function(id, pw, callback, thisObj) {
	var usr = this.users.find(function(usr) {
		return usr.getId() == id;
	});
	
	if (usr !== undefined)
	{
		callback.call(thisObj, usr);
	}
	else
	{
		var handle = this.handleCounter++;
		callback.call(thisObj, new User(this, handle, id, id));
	}
}

/****************
 * construct    *
 ****************/
exports.construct = function() {
	return new RawUserDb();
}
