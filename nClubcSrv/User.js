function User(usrdb, handle, id, nick) {
	this.userDb = usrdb;
	this.handle = handle;
	this.id = id;
	this.nick = nick;
	this.clients = [];
	this.joinedRooms = [];
}

User.prototype.getId = function() {
	return this.id;
}

User.prototype.getNick = function() {
	return this.nick;
}

User.prototype.getHandle = function() {
	return this.handle;
}

User.prototype.addClient = function(client) {
	this.clients.push(client);
}

User.prototype.removeClient = function(client) {
	this.clients.splice(
		this.clients.findIndex(function(c) {
			return c == client;
		}),
		1);
}

module.exports = User;
