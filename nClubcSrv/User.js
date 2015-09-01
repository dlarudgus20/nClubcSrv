function User(usrdb, handle, id, nick)
{
	this.userDb = usrdb;
	this.handle = handle;
	this.id = id;
	this.nick = nick;
	this.clients = [];
	this.joinedRooms = [];
	this.roomCounter = 0;
}

User.prototype.toString = function() {
	return '(User) ' + this.nick;
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
	this.clients.splice(this.clients.indexOf(client), 1);
}

User.prototype.getJoinedRooms = function() {
	return this.joinedRooms;
}

User.prototype.joinRoom = function(requester, room) {
	
}

User.prototype.createRoom = function(requester, name) {
	
}

User.prototype.exitRoom = function(requester, idx, reason) {
	
}

User.prototype.getRoomFromIdx = function(idx) {
	
}

module.exports = User;
