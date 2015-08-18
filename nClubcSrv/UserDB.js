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

RawUserDb.prototype.init = function() {
	
}

RawUserDb.prototype.getUser = function(handle) {
	return this.users.find(function(usr) {
		return usr.getHandle() == handle;
	});
}

RawUserDb.prototype.getUserFromNick = function(nick) {
	return this.users.find(function(usr) {
		return usr.getNick() == nick;
	});
}

RawUserDb.prototype.login = function(id, pw) {
	var usr = this.users.find(function(usr) {
		return usr.getId() == id;
	});
	
	if (usr !== undefined)
	{
		return usr;
	}
	else
	{
		var handle = this.handleCounter++;
		return new User(this, handle, id, id);
	}
}

/****************
 * construct    *
 ****************/
exports.construct = function() {
	return new RawUserDb();
}
